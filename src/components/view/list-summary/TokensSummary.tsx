import React from "react";

import { LIST_SUMMARY_REFETCH_INTERVAL } from "@/common/values/query.constant";
import UnknownToken from "@/assets/svgs/icon-unknown-token.svg";
import { useNetwork } from "@/common/hooks/use-network";
import { useFetchRemainingPages } from "@/common/hooks/common/use-fetch-remaining-pages";
import { useGetSummaryTokens } from "@/common/react-query/statistics";
import { useMappedApiTokens } from "@/common/services/token/use-mapped-api-tokens";
import { formatNftRelativeTime } from "@/common/utils/nft-time.utility";
import { makeDisplayNumber } from "@/common/utils/string-util";
import { summarizeTokenActivity24h, toTokenKey } from "@/common/utils/sort/token-list-sort";
import { SummaryCard, SummaryGrid, SummaryItemList, SummaryValue } from "./ListSummary";

const RECENT_TOKENS_PARAMS = { sort: "id", order: "desc" } as const;
// Same params as the default table sort, so both share one cached query.
const ALL_TOKENS_PARAMS = { sort: "holders", order: "desc" } as const;

const TokenLogo = ({ src }: { src: string | null | undefined }) => (src ? <img src={src} alt="" /> : <UnknownToken />);

export const TokensSummary = () => {
  const { getUrlWithNetwork } = useNetwork();
  const summary = useGetSummaryTokens();
  const recent = useMappedApiTokens(RECENT_TOKENS_PARAMS, { refetchInterval: LIST_SUMMARY_REFETCH_INTERVAL });

  const recentItems = React.useMemo(
    () =>
      recent.data.slice(0, 3).map(token => ({
        key: token.tokenId || token.packagePath,
        href: getUrlWithNetwork(`/tokens/${toTokenKey(token)}`),
        title: token.name,
        subtitle: token.symbol,
        meta: token.createdAt ? formatNftRelativeTime(token.createdAt) : undefined,
        media: <TokenLogo src={token.logoUrl} />,
      })),
    [recent.data, getUrlWithNetwork],
  );

  // 24h activity comes from the list's per token Transfers (24h) values, so the cards match the table below.
  const allTokens = useMappedApiTokens(ALL_TOKENS_PARAMS, { refetchInterval: LIST_SUMMARY_REFETCH_INTERVAL });
  useFetchRemainingPages(allTokens, true);
  const isActivityFetched = allTokens.isFetched && !allTokens.hasNextPage;

  const activity = React.useMemo(() => summarizeTokenActivity24h(allTokens.data), [allTokens.data]);

  const trendingItems = React.useMemo(
    () =>
      activity.top.map((token, index) => ({
        key: token.tokenId || token.packagePath,
        href: getUrlWithNetwork(`/tokens/${toTokenKey(token)}`),
        title: index === 0 ? token.name : `#${index + 1} ${token.name}`,
        subtitle: token.symbol,
        meta: `${makeDisplayNumber(token.transactionCount24h ?? 0)} transfers`,
        media: <TokenLogo src={token.logoUrl} />,
      })),
    [activity.top, getUrlWithNetwork],
  );

  const stats = summary.data?.data;

  return (
    <SummaryGrid>
      <SummaryCard title="Recently Registered" live>
        <SummaryItemList items={recentItems} isFetched={recent.isFetched} emptyText="No tokens registered yet" />
      </SummaryCard>
      <SummaryCard title="Trending Token" caption={trendingItems.length > 0 ? "Most active in 24h" : undefined}>
        <SummaryItemList
          items={trendingItems}
          isFetched={isActivityFetched}
          emptyText="No token activity in the last 24h"
        />
      </SummaryCard>
      <SummaryCard title="Unique Holders" caption="Wallets holding any GRC20">
        <SummaryValue value={stats?.holders} isFetched={summary.isFetched} />
      </SummaryCard>
      <SummaryCard title="24h Transfers" caption="Transfers in the last 24h">
        <SummaryValue value={activity.total} isFetched={isActivityFetched} />
      </SummaryCard>
    </SummaryGrid>
  );
};
