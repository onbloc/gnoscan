import React from "react";
import Link from "next/link";

import { useNftCollectionName } from "@/common/hooks/nft/use-nft-collection-name";
import { useNetwork } from "@/common/hooks/use-network";
import { useNftArtwork } from "@/common/hooks/nft/use-nft-artwork";
import { useGetSummaryNftCollections } from "@/common/react-query/statistics";
import { formatNftRelativeTime } from "@/common/utils/nft-time.utility";
import { makeNftTokenHash } from "@/common/utils/nft-token-hash.utility";
import { makeDisplayNumber, textEllipsis } from "@/common/utils/string-util";
import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";
import Text from "@/components/ui/text";
import { NftCollectionLogo } from "@/components/view/datatable/item/nft-collection-title";
import NftImage from "@/components/view/nft/nft-image/NftImage";
import {
  SummaryBars,
  SummaryBigNumber,
  SummaryCard,
  SummaryFacts,
  SummaryGrid,
  SummaryLegendDot,
  SummaryRows,
  countLabel,
  toPctBadge,
} from "./ListSummary";
import * as S from "./ListSummary.styles";

const formatAvgNfts = (average: number) => {
  const value = average.toFixed(1);
  return `${value} ${value === "1.0" ? "NFT" : "NFTs"}`;
};

export const NftsSummary = () => {
  const { getUrlWithNetwork } = useNetwork();
  const collectionName = useNftCollectionName();
  const query = useGetSummaryNftCollections();
  const summary = query.data?.data;

  // React Query keeps the same array across refetches with equal data, so the artwork lookup stays put.
  const mintedItems = summary?.justMinted;
  const justMinted = React.useMemo(() => (mintedItems ?? []).slice(0, 3), [mintedItems]);
  const artworkTokens = React.useMemo(
    () => justMinted.map(({ packagePath, nftId }) => ({ packagePath, nftId })),
    [justMinted],
  );
  const getArtwork = useNftArtwork(artworkTokens);

  // Show new holders when there are any, otherwise the transfers that moved the collection.
  const rising = (summary?.rising ?? []).slice(0, 3).map(collection => ({
    key: collection.tokenId,
    href: getUrlWithNetwork(`/tokens/${collection.tokenId}`),
    title: collectionName(collection.packagePath, collection.name),
    subtitle: [
      `+${countLabel(collection.mints24h, "mint")}`,
      collection.newHolders24h > 0
        ? `+${countLabel(collection.newHolders24h, "holder")}`
        : countLabel(collection.transfers24h, "transfer"),
    ].join(" · "),
    media: <NftCollectionLogo packagePath={collection.packagePath} />,
  }));

  const activity = summary?.activity;
  const topCollector = summary?.collectors.topCollector;

  return (
    <SummaryGrid>
      <SummaryCard title="Just Minted" live footer={summary && `${makeDisplayNumber(summary.mintsToday)} minted today`}>
        {query.isFetched && justMinted.length === 0 ? (
          <Text type="p4" color="tertiary">
            {query.isError ? "-" : "No recent mints"}
          </Text>
        ) : (
          <S.Tiles>
            {!query.isFetched && [0, 1, 2].map(index => <SkeletonBar key={index} width="100%" height={96} />)}
            {justMinted.map(mint => {
              const artwork = getArtwork(mint.packagePath, mint.nftId);
              const name = collectionName(mint.packagePath, mint.collectionName);
              const title = `${name} #${mint.nftId}`;
              return (
                <S.Tile
                  key={`${mint.tokenId}:${mint.nftId}`}
                  href={`${getUrlWithNetwork(`/tokens/${mint.tokenId}`)}${makeNftTokenHash(mint.nftId)}`}
                >
                  <NftImage src={artwork.src} isLoading={artwork.isLoading} alt={title} />
                  <Text type="body1" color="blue" className="ellipsis">
                    {name}
                  </Text>
                  <Text type="body1" color="tertiary">
                    {formatNftRelativeTime(mint.mintedAt)}
                  </Text>
                </S.Tile>
              );
            })}
          </S.Tiles>
        )}
      </SummaryCard>
      <SummaryCard title="Rising · 24h" footer="Mints + new holders">
        <SummaryRows
          rows={rising}
          isFetched={query.isFetched}
          isError={query.isError}
          emptyText="No collection activity in the last 24h"
          ranked
        />
      </SummaryCard>
      <SummaryCard
        title="Activity · 24h"
        footer={
          <>
            Daily · 7d
            <SummaryLegendDot color="blue" />
            {activity ? countLabel(activity.transfers24h, "transfer") : "- transfers"}
            <SummaryLegendDot color="orange" />
            {activity ? countLabel(activity.mints24h, "mint") : "- mints"}
          </>
        }
      >
        <SummaryBigNumber
          value={activity?.events24h}
          isFetched={query.isFetched}
          badge={toPctBadge(activity?.deltaPct, " vs yesterday")}
        />
        <SummaryBars
          label="Daily NFT transfers and mints, last 7 days"
          dates={activity?.daily.map(day => day.date) ?? []}
          series={[
            { color: "blue", name: "transfer", values: activity?.daily.map(day => day.transfers) ?? [] },
            { color: "orange", name: "mint", values: activity?.daily.map(day => day.mints) ?? [] },
          ]}
        />
      </SummaryCard>
      <SummaryCard title="Collectors" footer="User wallets holding any NFT">
        <SummaryBigNumber value={summary?.collectors.holdersTotal} isFetched={query.isFetched} />
        <SummaryFacts
          facts={[
            {
              label: "Top collector",
              value: topCollector ? (
                <Link href={getUrlWithNetwork(`/account/${topCollector.address}`)}>
                  <Text type="p4" color="blue">
                    {`${textEllipsis(topCollector.address)} · ${makeDisplayNumber(topCollector.nftCount)}`}
                  </Text>
                </Link>
              ) : (
                <Text type="p4">-</Text>
              ),
            },
            {
              label: "Avg per wallet",
              value: <Text type="p4">{summary ? formatAvgNfts(summary.collectors.avgPerWallet) : "-"}</Text>,
            },
            {
              label: "Held by realms",
              value: <Text type="p4">{summary ? countLabel(summary.collectors.realmHeld, "NFT") : "-"}</Text>,
            },
          ]}
        />
      </SummaryCard>
    </SummaryGrid>
  );
};
