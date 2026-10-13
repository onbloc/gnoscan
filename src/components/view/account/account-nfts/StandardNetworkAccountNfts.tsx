import React from "react";

import { useHistoryEntryState } from "@/common/hooks/detail-tabs/use-history-entry-state";
import { useGetAccountGRC721Collections } from "@/common/react-query/account/api/use-get-account-grc721-collections";
import { useGetAccountNfts } from "@/common/react-query/account/api/use-get-account-nfts";

import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";
import Text from "@/components/ui/text";
import { Pagination } from "@/components/ui/pagination";
import { CardTitle } from "../account-address/AccountAddress.styles";
import AccountNftCard from "./AccountNftCard";
import * as S from "./AccountNfts.styles";
import { Card as NftCardFrame } from "../../nft/nft-card/NftCard.styles";

const NFT_PAGE_SIZE = 20;
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
  const [page, setPage] = React.useState(1);

  const collections = React.useMemo(() => collectionsData?.items ?? [], [collectionsData]);
  const totalCount = React.useMemo(
    () => collections.reduce((sum, collection) => sum + collection.tokenCount, 0),
    [collections],
  );

  // ALL pages through every collection in order; a chip narrows it to one collection.
  const activeCollection = collections.find(collection => collection.tokenId === selectedCollection);
  const activeCollections = React.useMemo(
    () =>
      (activeCollection ? [activeCollection] : collections).map(({ tokenId, tokenCount }) => ({ tokenId, tokenCount })),
    [activeCollection, collections],
  );
  const selectedCount = activeCollection?.tokenCount ?? totalCount;
  const totalPages = Math.max(1, Math.ceil(selectedCount / NFT_PAGE_SIZE));
  const { data: nftData, isFetched: isFetchedNfts } = useGetAccountNfts({
    address,
    collections: activeCollections,
    page,
    pageSize: NFT_PAGE_SIZE,
  });
  const nfts = nftData?.items ?? [];

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
              setPage(1);
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
                setPage(1);
              }}
            />
          ))}
        </S.Chips>
      </S.Header>

      {!isFetchedNfts ? (
        <S.Grid aria-label="Loading NFTs">
          {Array.from({ length: NFT_PAGE_SIZE }, (_, index) => (
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
          {nfts.map(nft => (
            <AccountNftCard key={`${nft.tokenId}:${nft.nftId}`} nft={nft} />
          ))}
        </S.Grid>
      ) : (
        <Text type="p4" color="tertiary">
          No data to display
        </Text>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        hasNext={nftData?.page.hasNext}
        hideFirstPageButtonWhenDisabled
        hideLastPageButtonWhenCurrent
        onChangePage={nextPage => setPage(Math.min(Math.max(nextPage, 1), totalPages))}
      />
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
