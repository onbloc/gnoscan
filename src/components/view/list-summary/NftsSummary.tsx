import React from "react";

import { useNetwork } from "@/common/hooks/use-network";
import { useNftArtwork } from "@/common/hooks/nft/use-nft-artwork";
import { useGetRecentNftMints, useGetSummaryNftCollections } from "@/common/react-query/statistics";
import { formatNftRelativeTime } from "@/common/utils/nft-time.utility";
import { makeNftTokenHash } from "@/common/utils/nft-token-hash.utility";
import { makeDisplayNumber } from "@/common/utils/string-util";
import NftImage from "@/components/view/nft/nft-image/NftImage";
import { SummaryCard, SummaryGrid, SummaryItemList, SummaryValue } from "./ListSummary";

const RECENT_MINTS_LIMIT = 3;

export const NftsSummary = () => {
  const { getUrlWithNetwork } = useNetwork();
  const summary = useGetSummaryNftCollections();
  const recent = useGetRecentNftMints(RECENT_MINTS_LIMIT);

  const mints = recent.data?.items ?? [];
  // Only the featured mint shows artwork, which keeps the list page to one artwork lookup.
  const featuredPackagePath = mints[0]?.packagePath;
  const featuredNftId = mints[0]?.nftId;
  const featuredArtwork = React.useMemo(
    () => (featuredPackagePath && featuredNftId ? [{ packagePath: featuredPackagePath, nftId: featuredNftId }] : []),
    [featuredPackagePath, featuredNftId],
  );
  const getArtwork = useNftArtwork(featuredArtwork);

  const recentItems = mints.slice(0, RECENT_MINTS_LIMIT).map((mint, index) => {
    const title = `${mint.name} #${mint.nftId}`;
    const artwork = index === 0 ? getArtwork(mint.packagePath, mint.nftId) : null;
    return {
      key: `${mint.tokenId}:${mint.nftId}`,
      href: `${getUrlWithNetwork(`/tokens/${mint.tokenId}`)}${makeNftTokenHash(mint.nftId)}`,
      title,
      subtitle: mint.symbol,
      meta: formatNftRelativeTime(mint.mintedAt),
      media: artwork ? <NftImage src={artwork.src} isLoading={artwork.isLoading} alt={title} /> : undefined,
    };
  });

  const trendingItems = (summary.data?.data.trending ?? []).slice(0, 3).map((collection, index) => ({
    key: collection.tokenId,
    href: getUrlWithNetwork(`/tokens/${collection.tokenId}`),
    title: index === 0 ? collection.name : `#${index + 1} ${collection.name}`,
    subtitle: collection.symbol,
    meta: `${makeDisplayNumber(collection.mints24h)} mints · ${makeDisplayNumber(collection.transfers24h)} transfers`,
  }));

  const stats = summary.data?.data;

  return (
    <SummaryGrid>
      <SummaryCard title="Recently Minted" live>
        <SummaryItemList items={recentItems} isFetched={recent.isFetched} emptyText="No recent mints" />
      </SummaryCard>
      <SummaryCard title="Trending Collection" caption={trendingItems.length > 0 ? "Most active in 24h" : undefined}>
        <SummaryItemList
          items={trendingItems}
          isFetched={summary.isFetched}
          emptyText="No collection activity in the last 24h"
        />
      </SummaryCard>
      <SummaryCard title="Unique Holders" caption="Wallets holding any NFT">
        <SummaryValue value={stats?.holders} isFetched={summary.isFetched} />
      </SummaryCard>
      <SummaryCard title="24h Transfers" caption="Transfers in the last 24h">
        <SummaryValue value={stats?.transfers24h} isFetched={summary.isFetched} />
      </SummaryCard>
    </SummaryGrid>
  );
};
