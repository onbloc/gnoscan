import React from "react";

import { useSelectedNftToken } from "@/common/hooks/nft/use-selected-nft-token";
import { useWindowSize } from "@/common/hooks/use-window-size";
import { useNftInventoryControls } from "@/common/hooks/nft/use-nft-inventory-controls";
import { useNftArtwork } from "@/common/hooks/nft/use-nft-artwork";
import { useGetNftCollection } from "@/common/react-query/token/api";
import { isStakedNft } from "@/common/utils/nft-staking.utility";
import { NftCollectionItemModel } from "@/repositories/api/token/response";

import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";
import { Pagination } from "@/components/ui/pagination";
import Text from "@/components/ui/text";
import { DatatableItem } from "../../datatable";
import NftCard from "../nft-card/NftCard";
import { Card as NftCardFrame } from "../nft-card/NftCard.styles";
import NftTokenPanel from "../token-panel/NftTokenPanel";
import * as S from "./NftCollectionInventory.styles";
import NftInventoryToolbar from "./NftInventoryToolbar";

export const NFT_INVENTORY_PAGE_SIZE = 20;
const NFT_DETAIL_INVENTORY_PAGE_SIZE = 22;
const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

interface NftCollectionInventoryProps {
  tokenKey: string;
  symbol: string;
}

const NftCollectionInventory = ({ tokenKey, symbol }: NftCollectionInventoryProps) => {
  const { isDesktop } = useWindowSize();
  const [selectedNftId, selectToken] = useSelectedNftToken();
  // Retain the expanded page and last NFT until the closing transition finishes.
  const [retainedNftId, setRetainedNftId] = React.useState<string | null>(null);
  if (selectedNftId && retainedNftId !== selectedNftId) setRetainedNftId(selectedNftId);
  const panelNftId = selectedNftId ?? retainedNftId;
  // Only the desktop panel shares the grid: it fits 12 cards beside it plus two full rows below.
  const pageSize = isDesktop && panelNftId ? NFT_DETAIL_INVENTORY_PAGE_SIZE : NFT_INVENTORY_PAGE_SIZE;
  const {
    items,
    loadedItems,
    toolbarProps,
    isResolving,
    error,
    isFetched,
    page,
    totalPages,
    hasNext,
    onChangePage,
    onSelectItem,
    previousNftId,
    nextNftId,
  } = useNftInventoryControls(tokenKey, pageSize, selectedNftId);
  const { data: collectionData } = useGetNftCollection(tokenKey);
  const artwork = useNftArtwork(items);
  const scrollHandledForRef = React.useRef<string | null>(null);
  const selectInventoryToken = (nftId: string) => {
    // User-initiated selection must not move the viewport.
    scrollHandledForRef.current = nftId;
    onSelectItem(nftId);
    selectToken(nftId);
  };
  const [retainedItem, setRetainedItem] = React.useState<NftCollectionItemModel | null>(null);
  const currentItem = loadedItems.find(item => item.nftId === panelNftId) ?? null;
  if (selectedNftId && currentItem && retainedItem !== currentItem) setRetainedItem(currentItem);
  const selectedItem = currentItem ?? (retainedItem?.nftId === panelNftId ? retainedItem : null);

  const cardRefs = React.useRef(new Map<string, HTMLDivElement>());
  const previousPositions = React.useRef(new Map<string, { left: number; top: number }>());
  const previousHasPanel = React.useRef(false);
  const cardAnimations = React.useRef(new Map<string, Animation>());
  useIsomorphicLayoutEffect(() => {
    // Below desktop the panel is a bottom sheet over the grid, so the grid never reflows for it.
    const hasPanel = isDesktop && !!panelNftId;
    const reflowing = previousHasPanel.current !== hasPanel;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nextPositions = new Map<string, { left: number; top: number }>();
    if (reducedMotion) {
      cardAnimations.current.forEach(animation => animation.cancel());
      cardAnimations.current.clear();
    }
    cardRefs.current.forEach((card, id) => {
      // Grid-relative layout coordinates ignore scrolling and any in-flight card translation.
      const { offsetLeft: left, offsetTop: top } = card;
      nextPositions.set(id, { left, top });
      const previous = previousPositions.current.get(id);
      if (reducedMotion || !previous) return;
      const running = cardAnimations.current.get(id);
      const moving = running?.playState === "running";
      let x = previous.left - left;
      let y = previous.top - top;
      // Appending the extra NFTs must not cancel the opening transition.
      if (!reflowing && (!moving || (!x && !y))) return;
      if (moving) {
        const transform = window.getComputedStyle(card).transform;
        if (transform !== "none") {
          const matrix = new DOMMatrixReadOnly(transform);
          x += matrix.m41;
          y += matrix.m42;
        }
      }
      running?.cancel();
      if (x || y) {
        const animation = card.animate([{ transform: `translate(${x}px, ${y}px)` }, { transform: "translate(0, 0)" }], {
          duration: 400,
          easing: "ease",
        });
        cardAnimations.current.set(id, animation);
        animation.onfinish = () => {
          if (cardAnimations.current.get(id) === animation) cardAnimations.current.delete(id);
        };
      }
    });
    previousPositions.current = nextPositions;
    previousHasPanel.current = hasPanel;
    cardAnimations.current.forEach((animation, id) => {
      if (cardRefs.current.has(id)) return;
      animation.cancel();
      cardAnimations.current.delete(id);
    });
  }, [panelNftId, isDesktop, items]);
  useIsomorphicLayoutEffect(() => {
    const animations = cardAnimations.current;
    return () => {
      animations.forEach(animation => animation.cancel());
      animations.clear();
    };
  }, []);
  const panelRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const panel = panelRef.current;
    if (!isFetched || !selectedNftId || !panel || scrollHandledForRef.current === selectedNftId) return;
    scrollHandledForRef.current = selectedNftId;
    // Only deep links move the viewport, and they land on the detail panel; user selections keep it.
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [isFetched, selectedNftId, items]);

  return (
    <S.Container>
      <NftInventoryToolbar {...toolbarProps} />

      <S.Grid data-inventory-grid>
        {panelNftId && (
          <S.PanelSlot ref={panelRef} data-inventory-panel>
            <NftTokenPanel
              nftId={panelNftId}
              tokenKey={tokenKey}
              standardPackage={collectionData?.data.standardPackage ?? null}
              open={!!selectedNftId}
              onExited={() => {
                if (!selectedNftId) setRetainedNftId(null);
              }}
              packagePath={selectedItem?.packagePath ?? collectionData?.data.path ?? ""}
              symbol={symbol}
              item={selectedItem}
              previousNftId={previousNftId}
              nextNftId={nextNftId}
              onSelect={selectInventoryToken}
              onClose={() => selectToken(null)}
            />
          </S.PanelSlot>
        )}
        {!isFetched || isResolving ? (
          Array.from({ length: pageSize }, (_, index) => (
            <NftCardFrame key={index} size="compact" selected={false}>
              <SkeletonBar width="100%" height={183} borderRadius={8} />
              <SkeletonBar width="60%" height={24} />
              <SkeletonBar width="80%" height={24} />
            </NftCardFrame>
          ))
        ) : error ? (
          <S.EmptyState role="alert">
            <Text type="p4" color="tertiary">
              Could not load NFTs: {error.message}
            </Text>
          </S.EmptyState>
        ) : items.length === 0 ? (
          <S.EmptyState>
            <Text type="p4" color="tertiary">
              No data to display
            </Text>
          </S.EmptyState>
        ) : (
          items.map(item => {
            const { src, isLoading } = artwork(item.packagePath, item.nftId);
            return (
              <S.CardButton
                key={item.nftId}
                ref={element => {
                  if (element) cardRefs.current.set(item.nftId, element);
                  else cardRefs.current.delete(item.nftId);
                }}
                role="button"
                tabIndex={0}
                aria-label={`Token #${item.nftId} details`}
                aria-pressed={item.nftId === selectedNftId}
                onClick={event => {
                  // Owner link and copy icon keep their own behavior.
                  if ((event.target as HTMLElement).closest("a, .copy-tooltip")) return;
                  selectInventoryToken(item.nftId);
                }}
                onKeyDown={event => {
                  if (event.target !== event.currentTarget) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectInventoryToken(item.nftId);
                  }
                }}
              >
                <NftCard
                  nftId={item.nftId}
                  symbol={symbol}
                  imageUrl={src}
                  imageLoading={isLoading}
                  size="compact"
                  selected={item.nftId === selectedNftId}
                  staked={isStakedNft(item)}
                  burned={item.position?.burned === true}
                >
                  <S.OwnerRow>
                    <span>Owner:</span>
                    <DatatableItem.AddressCopy
                      address={item.ownerAddress}
                      label={item.ownerLabel}
                      labelType={item.ownerLabelType}
                      truncateFromStart
                    />
                  </S.OwnerRow>
                </NftCard>
              </S.CardButton>
            );
          })
        )}
      </S.Grid>
      <Pagination
        page={page}
        totalPages={totalPages}
        hasNext={hasNext}
        hideFirstPageButtonWhenDisabled
        hideLastPageButtonWhenCurrent
        onChangePage={onChangePage}
      />
    </S.Container>
  );
};

export default NftCollectionInventory;
