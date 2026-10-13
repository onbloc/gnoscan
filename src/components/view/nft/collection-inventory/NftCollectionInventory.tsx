import React from "react";

import { useSelectedNftToken } from "@/common/hooks/nft/use-selected-nft-token";
import { useNftInventoryControls } from "@/common/hooks/nft/use-nft-inventory-controls";
import { useGetNftCollection } from "@/common/react-query/token/api";
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
const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

interface NftCollectionInventoryProps {
  tokenKey: string;
  symbol: string;
}

const NftCollectionInventory = ({ tokenKey, symbol }: NftCollectionInventoryProps) => {
  const { items, loadedItems, toolbarProps, isResolving, error, isFetched, page, totalPages, hasNext, onChangePage } =
    useNftInventoryControls(tokenKey, NFT_INVENTORY_PAGE_SIZE);
  const { data: collectionData } = useGetNftCollection(tokenKey);

  const [selectedNftId, selectToken] = useSelectedNftToken();
  // Retain the last NFT while the closing transition runs.
  const [retainedNftId, setRetainedNftId] = React.useState<string | null>(null);
  if (selectedNftId && retainedNftId !== selectedNftId) setRetainedNftId(selectedNftId);
  const panelNftId = selectedNftId ?? retainedNftId;
  const selectedIndex = items.findIndex(item => item.nftId === panelNftId);
  const [retainedItem, setRetainedItem] = React.useState<NftCollectionItemModel | null>(null);
  const currentItem = loadedItems.find(item => item.nftId === panelNftId) ?? null;
  if (selectedNftId && currentItem && retainedItem !== currentItem) setRetainedItem(currentItem);
  const selectedItem = currentItem ?? (retainedItem?.nftId === panelNftId ? retainedItem : null);

  const cardRefs = React.useRef(new Map<string, HTMLDivElement>());
  const previousPositions = React.useRef(new Map<string, { left: number; top: number }>());
  const previousHasPanel = React.useRef(false);
  useIsomorphicLayoutEffect(() => {
    const hasPanel = !!panelNftId;
    const reflowing = previousHasPanel.current !== hasPanel;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nextPositions = new Map<string, { left: number; top: number }>();
    const animations: Animation[] = [];
    cardRefs.current.forEach((card, id) => {
      const { left, top } = card.getBoundingClientRect();
      nextPositions.set(id, { left, top });
      const previous = previousPositions.current.get(id);
      if (!reflowing || reducedMotion || !previous) return;
      const x = previous.left - left;
      const y = previous.top - top;
      if (x || y) {
        animations.push(
          card.animate([{ transform: `translate(${x}px, ${y}px)` }, { transform: "translate(0, 0)" }], {
            duration: 400,
            easing: "ease",
          }),
        );
      }
    });
    previousPositions.current = nextPositions;
    previousHasPanel.current = hasPanel;
    return () => animations.forEach(animation => animation.cancel());
  }, [panelNftId, items]);
  const scrolledToRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!isFetched || !selectedNftId || scrolledToRef.current === selectedNftId) return;
    scrolledToRef.current = selectedNftId;
    // Deep link and prev/next: bring the marked card into view when it is in the grid.
    cardRefs.current.get(selectedNftId)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [isFetched, selectedNftId]);

  return (
    <S.Container>
      <NftInventoryToolbar {...toolbarProps} />

      <S.Grid data-inventory-grid>
        {panelNftId && (
          <S.PanelSlot data-inventory-panel>
            <NftTokenPanel
              nftId={panelNftId}
              open={!!selectedNftId}
              onExited={() => {
                if (!selectedNftId) setRetainedNftId(null);
              }}
              packagePath={selectedItem?.packagePath ?? collectionData?.data.path ?? ""}
              symbol={symbol}
              item={selectedItem}
              previousNftId={selectedIndex > 0 ? items[selectedIndex - 1].nftId : null}
              nextNftId={
                selectedIndex !== -1 && selectedIndex < items.length - 1 ? items[selectedIndex + 1].nftId : null
              }
              onSelect={selectToken}
              onClose={() => selectToken(null)}
            />
          </S.PanelSlot>
        )}
        {!isFetched || isResolving ? (
          Array.from({ length: NFT_INVENTORY_PAGE_SIZE }, (_, index) => (
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
          items.map(item => (
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
                selectToken(item.nftId);
              }}
              onKeyDown={event => {
                if (event.target !== event.currentTarget) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  selectToken(item.nftId);
                }
              }}
            >
              <NftCard nftId={item.nftId} symbol={symbol} size="compact" selected={item.nftId === selectedNftId}>
                <S.OwnerRow>
                  <span>Owner:</span>
                  <DatatableItem.AddressCopy
                    address={item.ownerAddress}
                    label={item.ownerLabel}
                    labelType={item.ownerLabelType}
                  />
                </S.OwnerRow>
              </NftCard>
            </S.CardButton>
          ))
        )}
      </S.Grid>
      <Pagination
        page={page}
        totalPages={totalPages}
        hasNext={hasNext}
        hideFirstPageButtonWhenDisabled
        hideLastPageButtonWhenCurrent
        onChangePage={nextPage => {
          selectToken(null);
          onChangePage(nextPage);
        }}
      />
    </S.Container>
  );
};

export default NftCollectionInventory;
