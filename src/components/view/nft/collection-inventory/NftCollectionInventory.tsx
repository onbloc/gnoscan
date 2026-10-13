import React from "react";

import { useSelectedNftToken } from "@/common/hooks/nft/use-selected-nft-token";
import { useInfiniteScroll } from "@/common/hooks/use-infinite-scroll";
import { useGetNftCollection, useGetNftCollectionItems } from "@/common/react-query/token/api";

import IconSearch from "@/assets/svgs/icon-search.svg";
import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";
import Text from "@/components/ui/text";
import { DatatableItem } from "../../datatable";
import NftCard from "../nft-card/NftCard";
import { Card as NftCardFrame } from "../nft-card/NftCard.styles";
import NftTokenPanel from "../token-panel/NftTokenPanel";
import * as S from "./NftCollectionInventory.styles";

export const NFT_INVENTORY_PAGE_SIZE = 20;

interface NftCollectionInventoryProps {
  tokenKey: string;
  symbol: string;
}

const NftCollectionInventory = ({ tokenKey, symbol }: NftCollectionInventoryProps) => {
  const { data, isFetched, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetNftCollectionItems({
    tokenKey,
    limit: NFT_INVENTORY_PAGE_SIZE,
  });
  const { data: collectionData } = useGetNftCollection(tokenKey);
  const items = React.useMemo(() => data?.pages.flatMap(page => page.items) ?? [], [data]);
  const sentinelRef = useInfiniteScroll<HTMLDivElement>({ hasNextPage, isFetchingNextPage, fetchNextPage });

  // The panel opens from the URL token right away; the grid only marks it when it is on the first page.
  const [selectedNftId, selectToken] = useSelectedNftToken();
  const selectedIndex = items.findIndex(item => item.nftId === selectedNftId);
  const selectedItem = selectedIndex === -1 ? null : items[selectedIndex];

  const cardRefs = React.useRef(new Map<string, HTMLDivElement>());
  const scrolledToRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!isFetched || !selectedNftId || scrolledToRef.current === selectedNftId) return;
    scrolledToRef.current = selectedNftId;
    // Deep link and prev/next: bring the marked card into view when it is in the grid.
    cardRefs.current.get(selectedNftId)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [isFetched, selectedNftId]);

  const hasPanel = !!selectedNftId;

  return (
    <S.Container>
      {/* Search, owner filter and sort wait for API support. */}
      <S.Toolbar>
        <S.SearchBox aria-disabled>
          <input placeholder="Search by Token ID or Owner’s Address" disabled />
          <IconSearch />
        </S.SearchBox>
        <S.FilterButtons>
          <S.FilterButton type="button" disabled>
            Owner: All ▾
          </S.FilterButton>
          <S.FilterButton type="button" disabled>
            Token ID ↓
          </S.FilterButton>
        </S.FilterButtons>
      </S.Toolbar>

      <S.Body hasPanel={hasPanel}>
        {!isFetched ? (
          <S.Grid hasPanel={hasPanel} aria-label="Loading NFTs">
            {Array.from({ length: 10 }, (_, index) => (
              <NftCardFrame key={index} size="compact" selected={false}>
                <SkeletonBar width="100%" height={183} borderRadius={8} />
                <SkeletonBar width="60%" height={24} />
                <SkeletonBar width="80%" height={24} />
              </NftCardFrame>
            ))}
          </S.Grid>
        ) : items.length === 0 ? (
          <Text type="p4" color="tertiary">
            No data to display
          </Text>
        ) : (
          <div>
            <S.Grid hasPanel={hasPanel}>
              {items.map(item => (
                <S.CardButton
                  key={item.nftId}
                  ref={element => {
                    if (element) cardRefs.current.set(item.nftId, element);
                    else cardRefs.current.delete(item.nftId);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={item.nftId === selectedNftId}
                  onClick={event => {
                    // Owner link and copy icon keep their own behavior.
                    if ((event.target as HTMLElement).closest("a, .copy-tooltip")) return;
                    selectToken(item.nftId);
                  }}
                  onKeyDown={event => {
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
              ))}
            </S.Grid>
            <S.Sentinel ref={sentinelRef} />
          </div>
        )}

        {selectedNftId && (
          <NftTokenPanel
            key={selectedNftId}
            nftId={selectedNftId}
            packagePath={selectedItem?.packagePath ?? collectionData?.data.path ?? ""}
            symbol={symbol}
            item={selectedItem}
            previousNftId={selectedIndex > 0 ? items[selectedIndex - 1].nftId : null}
            nextNftId={selectedIndex !== -1 && selectedIndex < items.length - 1 ? items[selectedIndex + 1].nftId : null}
            onSelect={selectToken}
            onClose={() => selectToken(null)}
          />
        )}
      </S.Body>
    </S.Container>
  );
};

export default NftCollectionInventory;
