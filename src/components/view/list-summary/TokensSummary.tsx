import React from "react";
import Link from "next/link";

import { LIST_SUMMARY_REFETCH_INTERVAL } from "@/common/values/query.constant";
import UnknownToken from "@/assets/svgs/icon-unknown-token.svg";
import { useNetwork } from "@/common/hooks/use-network";
import { useFetchRemainingPages } from "@/common/hooks/common/use-fetch-remaining-pages";
import { useGetSummaryTokens } from "@/common/react-query/statistics";
import { useMappedApiTokens } from "@/common/services/token/use-mapped-api-tokens";
import { formatNftRelativeTime } from "@/common/utils/nft-time.utility";
import { makeDisplayNumber } from "@/common/utils/string-util";
import { summarizeTokenActivity24h, toTokenKey } from "@/common/utils/sort/token-list-sort";
import Text from "@/components/ui/text";
import {
  SummaryBars,
  SummaryBigNumber,
  SummaryCard,
  SummaryFacts,
  SummaryGrid,
  SummaryRows,
  toCountBadge,
  toPctBadge,
} from "./ListSummary";

const RECENT_TOKENS_PARAMS = { sort: "id", order: "desc" } as const;
// Same params as the default table sort, so both share one cached query.
const ALL_TOKENS_PARAMS = { sort: "holders", order: "desc" } as const;

const TokenLogo = ({ src }: { src: string | null | undefined }) => (src ? <img src={src} alt="" /> : <UnknownToken />);

export const TokensSummary = () => {
  const { getUrlWithNetwork } = useNetwork();
  const summaryQuery = useGetSummaryTokens();
  const summary = summaryQuery.data?.data;
  const recent = useMappedApiTokens(RECENT_TOKENS_PARAMS, { refetchInterval: LIST_SUMMARY_REFETCH_INTERVAL });

  // Items and 24h counts come from the token list, so the cards match the table below. The summary API adds the
  // changes, daily bars and holder totals.
  const allTokens = useMappedApiTokens(ALL_TOKENS_PARAMS, { refetchInterval: LIST_SUMMARY_REFETCH_INTERVAL });
  useFetchRemainingPages(allTokens, true);
  // A failed page stops the paging, so settle on the loaded pages instead of loading forever.
  const isListFetched = allTokens.isFetched && (!allTokens.hasNextPage || allTokens.isError);
  // react-query marks a failed first page as fetched, so a failure with no rows shows "-" instead of 0.
  const listFailed = allTokens.isError && allTokens.data.length === 0;
  const activity = React.useMemo(() => summarizeTokenActivity24h(allTokens.data), [allTokens.data]);
  const tokenUrl = (token: { packagePath: string; symbol: string }) =>
    getUrlWithNetwork(`/tokens/${toTokenKey(token)}`);

  // Unregistered tokens (backfilled ones such as xGNS) were never "added", so they stay out of this card.
  const newlyAdded = recent.data
    .filter(token => token.registered)
    .slice(0, 3)
    .map(token => ({
      key: token.tokenId || token.packagePath,
      href: tokenUrl(token),
      title: token.name,
      subtitle: token.symbol,
      media: <TokenLogo src={token.logoUrl} />,
      value: token.createdAt ? formatNftRelativeTime(token.createdAt) : undefined,
    }));

  const deltaByToken = new Map(summary?.mostActive.map(item => [item.tokenId, item.deltaPct]));
  const mostActive = activity.top.map(token => ({
    key: token.tokenId || token.packagePath,
    href: tokenUrl(token),
    title: token.name,
    subtitle: token.symbol,
    media: <TokenLogo src={token.logoUrl} />,
    value: makeDisplayNumber(token.transactionCount24h ?? 0),
    badge: toPctBadge(deltaByToken.get(token.tokenId)),
  }));

  const activeTokens = allTokens.data.filter(token => (token.transactionCount24h ?? 0) > 0).length;
  const transferDetails = [
    "Daily · last 7 days",
    isListFetched && `${makeDisplayNumber(activeTokens)} tokens`,
    summary && `${makeDisplayNumber(summary.transfers.uniqueSenders24h)} senders`,
  ];

  const mostHeld = allTokens.data.reduce<(typeof allTokens.data)[number] | undefined>(
    (top, token) => (!top || token.holders > top.holders ? token : top),
    undefined,
  );
  const fastestGrowing = summary?.holders.fastestGrowing;

  return (
    <SummaryGrid>
      <SummaryCard
        title="Newly added"
        live
        footer={summary && `${makeDisplayNumber(summary.weeklyNewCount)} registered this week`}
      >
        <SummaryRows
          rows={newlyAdded}
          isFetched={recent.isFetched}
          isError={recent.isError}
          emptyText="No tokens registered yet"
        />
      </SummaryCard>
      <SummaryCard title="Most Active · 24h" footer="Transfers · vs previous 24h">
        <SummaryRows
          rows={mostActive}
          isFetched={isListFetched}
          isError={allTokens.isError}
          emptyText="No token activity in the last 24h"
          ranked
        />
      </SummaryCard>
      <SummaryCard title="Transfers · 24h" footer={transferDetails.filter(Boolean).join(" · ")}>
        <SummaryBigNumber
          value={isListFetched && !listFailed ? activity.total : undefined}
          isFetched={isListFetched}
          badge={toPctBadge(summary?.transfers.deltaPct, " vs yesterday")}
        />
        <SummaryBars
          label="Daily transfers, last 7 days"
          dates={summary?.transfers.daily.map(day => day.date) ?? []}
          series={[{ color: "blue", values: summary?.transfers.daily.map(day => day.count) ?? [] }]}
        />
      </SummaryCard>
      <SummaryCard title="Holders" footer="Wallets holding any GRC20">
        <SummaryBigNumber
          value={summary?.holders.holdersTotal}
          isFetched={summaryQuery.isFetched}
          badge={toCountBadge(summary?.holders.holdersDelta7d, " this week")}
        />
        <SummaryFacts
          facts={[
            {
              label: "Most held",
              value: mostHeld ? (
                <Link href={tokenUrl(mostHeld)}>
                  <Text type="p4" color="blue">{`${mostHeld.name} · ${makeDisplayNumber(mostHeld.holders)}`}</Text>
                </Link>
              ) : (
                <Text type="p4">-</Text>
              ),
            },
            {
              label: "Fastest growing",
              value: fastestGrowing ? (
                <Link href={getUrlWithNetwork(`/tokens/${fastestGrowing.tokenId}`)}>
                  <Text type="p4" color="blue">
                    {`${fastestGrowing.symbol} · +${makeDisplayNumber(fastestGrowing.holdersDelta7d)}`}
                  </Text>
                </Link>
              ) : (
                <Text type="p4">-</Text>
              ),
            },
          ]}
        />
      </SummaryCard>
    </SummaryGrid>
  );
};
