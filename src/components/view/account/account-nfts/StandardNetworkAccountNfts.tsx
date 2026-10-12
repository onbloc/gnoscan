import React from "react";

import { useHistoryEntryState } from "@/common/hooks/detail-tabs/use-history-entry-state";
import { useGetAccountGRC721Collections } from "@/common/react-query/account/api/use-get-account-grc721-collections";
import { useGetAccountNfts } from "@/common/react-query/account/api/use-get-account-nfts";

import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";
import Text from "@/components/ui/text";
import { CardTitle } from "../account-address/AccountAddress.styles";
import AccountNftCard from "./AccountNftCard";
import * as S from "./AccountNfts.styles";
import { Card as NftCardFrame } from "../../nft/nft-card/NftCard.styles";

// Two desktop rows before View More
const NFT_INITIAL_COUNT = 8;
// View More loads every remaining NFT in API-max pages (handlerCommon.MaxPageSize)
const NFT_LOAD_ALL_PAGE_SIZE = 100;
const ALL_COLLECTIONS = "ALL";

interface AccountNftsProps {
  address: string;
}

const StandardNetworkAccountNfts = ({ address }: AccountNftsProps) => {
  const { data: collectionsData, isFetched: isFetchedCollections } = useGetAccountGRC721Collections(address);
  const [selectedCollection, setSelectedCollection] = useHistoryEntryState<string>(
    `account:${address}:nft-collection`,
    ALL_COLLECTIONS,
  );

  const collections = React.useMemo(() => collectionsData?.items ?? [], [collectionsData]);
  const totalCount = React.useMemo(
    () => collections.reduce((sum, collection) => sum + collection.tokenCount, 0),
    [collections],
  );

  // ALL pages through every collection in order; a chip narrows it to one collection.
  const activeCollection = collections.find(collection => collection.tokenId === selectedCollection);
  const collectionTokenIds = React.useMemo(
    () => (activeCollection ? [activeCollection] : collections).map(collection => collection.tokenId),
    [activeCollection, collections],
  );

  const {
    data: nftData,
    isFetched: isFetchedNfts,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetAccountNfts({
    address,
    collectionTokenIds,
    firstPageSize: NFT_INITIAL_COUNT,
    pageSize: NFT_LOAD_ALL_PAGE_SIZE,
  });

  const nfts = React.useMemo(() => nftData?.pages.flatMap(page => page.items) ?? [], [nftData]);

  // View More shows every NFT of the selected chip; switching chips starts again at the first 8.
  const [isShowingAll, setIsShowingAll] = React.useState(false);

  React.useEffect(() => {
    if (isShowingAll && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [isShowingAll, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // The section only appears for accounts that hold NFTs.
  if (!isFetchedCollections || collections.length === 0) {
    return null;
  }

  return (
    <S.Card>
      <S.Header>
        <S.TitleWrapper>
          <CardTitle aria-label="title">NFTs</CardTitle>
          <S.CountPill type="p4" color="primary">
            {totalCount.toLocaleString()}
          </S.CountPill>
        </S.TitleWrapper>
        <S.Chips role="tablist" aria-label="NFT collections">
          <CollectionChip
            label="ALL"
            count={totalCount}
            selected={!activeCollection}
            onClick={() => {
              setSelectedCollection(ALL_COLLECTIONS);
              setIsShowingAll(false);
            }}
          />
          {collections.map(collection => (
            <CollectionChip
              key={collection.tokenId}
              label={collection.name || collection.symbol}
              count={collection.tokenCount}
              selected={collection === activeCollection}
              onClick={() => {
                setSelectedCollection(collection.tokenId);
                setIsShowingAll(false);
              }}
            />
          ))}
        </S.Chips>
      </S.Header>

      {!isFetchedNfts ? (
        <S.Grid aria-label="Loading NFTs">
          {Array.from({ length: NFT_INITIAL_COUNT }, (_, index) => (
            <NftCardFrame key={index} size="regular" selected={false}>
              <S.SkeletonImage>
                <SkeletonBar width="100%" height="100%" borderRadius={8} />
              </S.SkeletonImage>
              <SkeletonBar width="60%" height={24} />
              <SkeletonBar width="80%" height={24} />
            </NftCardFrame>
          ))}
        </S.Grid>
      ) : nfts.length > 0 ? (
        <S.Grid>
          {(isShowingAll ? nfts : nfts.slice(0, NFT_INITIAL_COUNT)).map(nft => (
            <AccountNftCard key={`${nft.tokenId}:${nft.nftId}`} nft={nft} />
          ))}
        </S.Grid>
      ) : (
        <Text type="p4" color="tertiary">
          No data to display
        </Text>
      )}

      {/* Stays (disabled) while the remaining NFTs load, then goes away */}
      {(isShowingAll ? hasNextPage : hasNextPage || nfts.length > NFT_INITIAL_COUNT) && (
        <S.ViewMoreButton text="View More NFTs" onClick={() => setIsShowingAll(true)} disabled={isShowingAll} />
      )}
    </S.Card>
  );
};

interface CollectionChipProps {
  label: string;
  count: number;
  selected: boolean;
  onClick: () => void;
}

const CollectionChip = ({ label, count, selected, onClick }: CollectionChipProps) => (
  <S.Chip type="button" role="tab" aria-selected={selected} selected={selected} onClick={onClick}>
    <S.ChipLabel data-label={label}>{label}</S.ChipLabel>
    <S.ChipCount>{count.toLocaleString()}</S.ChipCount>
  </S.Chip>
);

export default StandardNetworkAccountNfts;
