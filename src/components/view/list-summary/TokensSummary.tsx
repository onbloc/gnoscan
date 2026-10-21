import React from "react";

import { LIST_SUMMARY_REFETCH_INTERVAL } from "@/common/values/query.constant";
import UnknownToken from "@/assets/svgs/icon-unknown-token.svg";
import { useNetwork } from "@/common/hooks/use-network";
import { useTokenResourceMeta } from "@/common/hooks/common/use-token-resource-meta";
import { useGetSummaryTokens } from "@/common/react-query/statistics";
import { useMappedApiTokens } from "@/common/services/token/use-mapped-api-tokens";
import { formatNftRelativeTime } from "@/common/utils/nft-time.utility";
import { makeDisplayNumber } from "@/common/utils/string-util";
import { toTokenKey } from "@/common/utils/sort/token-list-sort";
import { SummaryCard, SummaryGrid, SummaryItemList, SummaryValue } from "./ListSummary";

const RECENT_TOKENS_PARAMS = { sort: "id", order: "desc" } as const;

const TokenLogo = ({ src }: { src: string | null | undefined }) => (src ? <img src={src} alt="" /> : <UnknownToken />);

export const TokensSummary = () => {
  const { getUrlWithNetwork } = useNetwork();
  const { getTokenMeta } = useTokenResourceMeta();
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

  const trendingItems = React.useMemo(
    () =>
      (summary.data?.data.trending ?? []).slice(0, 3).map((token, index) => {
        const meta = getTokenMeta(token.tokenId || token.packagePath, {
          name: token.name,
          symbol: token.symbol,
          decimals: 0,
          image: token.logoUrl ?? undefined,
        });
        return {
          key: token.tokenId,
          href: getUrlWithNetwork(`/tokens/${toTokenKey(token)}`),
          title: index === 0 ? meta.name : `#${index + 1} ${meta.name}`,
          subtitle: meta.symbol,
          meta: `${makeDisplayNumber(token.transfers24h)} transfers`,
          media: <TokenLogo src={meta.image} />,
        };
      }),
    [summary.data, getTokenMeta, getUrlWithNetwork],
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
          isFetched={summary.isFetched}
          emptyText="No token activity in the last 24h"
        />
      </SummaryCard>
      <SummaryCard title="Unique Holders" caption="Wallets holding any GRC20">
        <SummaryValue value={stats?.holders} isFetched={summary.isFetched} />
      </SummaryCard>
      <SummaryCard title="24h Transfers" caption="Transfers in the last 24h">
        <SummaryValue value={stats?.transfers24h} isFetched={summary.isFetched} />
      </SummaryCard>
    </SummaryGrid>
  );
};
