import React from "react";
import Link from "next/link";

import { LIST_SUMMARY_REFETCH_INTERVAL } from "@/common/values/query.constant";
import UnknownToken from "@/assets/svgs/icon-unknown-token.svg";
import { useNetwork } from "@/common/hooks/use-network";
import { useTokenResourceMeta } from "@/common/hooks/common/use-token-resource-meta";
import { useGetSummaryTokens } from "@/common/react-query/statistics";
import { useMappedApiTokens } from "@/common/services/token/use-mapped-api-tokens";
import { formatNftRelativeTime } from "@/common/utils/nft-time.utility";
import { makeDisplayNumber } from "@/common/utils/string-util";
import { toTokenKey } from "@/common/utils/sort/token-list-sort";
import { SummaryTokenModel } from "@/repositories/api/statistics/response/get-list-summary-response";
import Text from "@/components/ui/text";
import {
  SummaryBars,
  SummaryBigNumber,
  SummaryCard,
  SummaryFacts,
  SummaryGrid,
  SummaryRows,
  countLabel,
  toPctBadge,
} from "./ListSummary";
import * as S from "./ListSummary.styles";

const RECENT_TOKENS_PARAMS = { sort: "createdAt", order: "desc" } as const;

const TokenLogo = ({ src }: { src: string | null | undefined }) => (src ? <img src={src} alt="" /> : <UnknownToken />);

export const TokensSummary = () => {
  const { getUrlWithNetwork } = useNetwork();
  const summaryQuery = useGetSummaryTokens();
  const summary = summaryQuery.data?.data;
  const recent = useMappedApiTokens(RECENT_TOKENS_PARAMS, {
    refetchInterval: LIST_SUMMARY_REFETCH_INTERVAL,
    keepPreviousData: false,
  });

  const { getTokenMeta } = useTokenResourceMeta();
  const tokenUrl = (token: { packagePath: string; symbol: string }) =>
    getUrlWithNetwork(`/tokens/${toTokenKey(token)}`);
  // Names, symbols and logos resolve like the token list rows, so a token reads the same in the cards and the table.
  const resolveToken = <T extends SummaryTokenModel>(token: T) => {
    const meta = getTokenMeta(token.tokenId || token.packagePath, {
      name: token.name,
      symbol: token.symbol,
      decimals: 0,
      image: token.logoUrl ?? undefined,
    });
    return { ...token, name: meta.name, symbol: meta.symbol, logoUrl: meta.image || "" };
  };

  const newlyAdded = recent.data.slice(0, 3).map(token => ({
    key: token.tokenId || token.packagePath,
    href: tokenUrl(token),
    title: token.name,
    subtitle: token.symbol,
    media: <TokenLogo src={token.logoUrl} />,
    value: token.createdAt ? formatNftRelativeTime(token.createdAt) : undefined,
    valueHref: token.createdTransactionHash
      ? getUrlWithNetwork(`/transactions/details?txhash=${token.createdTransactionHash}`)
      : undefined,
  }));

  const mostActive = (summary?.mostActive ?? []).map(item => {
    const token = resolveToken(item);
    return {
      key: token.tokenId,
      href: tokenUrl(token),
      title: token.name,
      subtitle: token.symbol,
      media: <TokenLogo src={token.logoUrl} />,
      value: makeDisplayNumber(item.transfers24h),
      badge: toPctBadge(item.deltaPct),
    };
  });

  const transferDetails = [
    "Last 7 days",
    summary && countLabel(summary.transfers.activeTokens24h, "token"),
    summary && countLabel(summary.transfers.uniqueSenders24h, "sender"),
  ];

  const mostHeld = summary?.holders.mostHeld ? resolveToken(summary.holders.mostHeld) : undefined;
  const fastestGrowing = summary?.holders.fastestGrowing ? resolveToken(summary.holders.fastestGrowing) : undefined;

  return (
    <SummaryGrid>
      <SummaryCard
        title="Newly added"
        live
        footer={summary && `${makeDisplayNumber(summary.weeklyNewCount)} added in 7 days`}
      >
        <SummaryRows
          rows={newlyAdded}
          isFetched={recent.isFetched}
          isError={recent.isError}
          emptyText="No tokens added yet"
        />
      </SummaryCard>
      <SummaryCard title="Most Active · 24h" footer="Transfers · vs previous 24h">
        <SummaryRows
          rows={mostActive}
          isFetched={summaryQuery.isFetched}
          isError={summaryQuery.isError}
          emptyText="No token activity in the last 24h"
          ranked
        />
      </SummaryCard>
      <SummaryCard title="Transfers · 24h" footer={transferDetails.filter(Boolean).join(" · ")}>
        <SummaryBigNumber
          value={summary?.transfers.count24h}
          isFetched={summaryQuery.isFetched}
          badge={toPctBadge(summary?.transfers.deltaPct, " vs previous 24h")}
        />
        <SummaryBars
          label="Transfers per 24h, last 7 days"
          periods={summary?.transfers.daily ?? []}
          series={[{ color: "blue", values: summary?.transfers.daily.map(day => day.count) ?? [] }]}
        />
      </SummaryCard>
      <SummaryCard title="Holders" footer="Wallets holding any GRC20">
        <SummaryBigNumber value={summary?.holders.holdersTotal} isFetched={summaryQuery.isFetched} />
        <SummaryFacts
          facts={[
            {
              label: "Most held",
              value: mostHeld ? (
                <Link href={tokenUrl(mostHeld)}>
                  <S.FactToken>
                    <TokenLogo src={mostHeld.logoUrl} />
                    <Text type="p4" color="blue">{`${mostHeld.name} · ${makeDisplayNumber(mostHeld.holders)}`}</Text>
                  </S.FactToken>
                </Link>
              ) : (
                <Text type="p4">-</Text>
              ),
            },
            {
              label: "Fastest growing",
              value: fastestGrowing ? (
                <Link href={tokenUrl(fastestGrowing)}>
                  <S.FactToken>
                    <TokenLogo src={fastestGrowing.logoUrl} />
                    <Text type="p4" color="blue">
                      {`${fastestGrowing.symbol} · +${makeDisplayNumber(fastestGrowing.holdersDelta7d)}`}
                    </Text>
                  </S.FactToken>
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
