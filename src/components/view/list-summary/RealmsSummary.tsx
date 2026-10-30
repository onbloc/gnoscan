import React from "react";
import Link from "next/link";

import { useNetwork } from "@/common/hooks/use-network";
import { useGetSummaryRealms } from "@/common/react-query/statistics";
import { formatBytes } from "@/common/utils/format/format-utils";
import { formatDisplayPackagePath, makeDisplayNumber, textEllipsis } from "@/common/utils/string-util";
import { stripGnoLandPrefix } from "@/common/utils/token.utility";
import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";
import PathText from "@/components/ui/path-text/PathText";
import Text from "@/components/ui/text";
import { EllipsisTooltip } from "@/components/ui/tooltip";
import {
  DeltaBadgeData,
  SummaryBars,
  SummaryBigNumber,
  SummaryCard,
  SummaryFacts,
  SummaryGrid,
  SummaryRows,
  countLabel,
  toCountBadge,
  toPctBadge,
} from "./ListSummary";
import * as S from "./ListSummary.styles";

const displayPath = (path: string) => formatDisplayPackagePath(stripGnoLandPrefix(path));

const realmUrl = (path: string) => `/realms/details?path=${path}`;

// GNOT amounts show one decimal, as in the design notes.
const formatGnot = (value: number) => value.toFixed(1);

// The sign follows the rounded value, so a tiny loss reads +0.0 instead of -0.0.
const signedGnot = (value: number) => {
  const rounded = Number(value.toFixed(1));
  return `${rounded >= 0 ? "+" : "-"}${formatGnot(Math.abs(rounded))}`;
};

// A publisher with no deploys in the previous week is "new" rather than "+N".
const toBuilderBadge = (current: number, previous: number): DeltaBadgeData | undefined =>
  previous === 0 && current > 0 ? { label: "new", tone: "up" } : toCountBadge(current - previous);

// The full address or path on hover, like the realm table.
const withFullText = (full: string, node: React.ReactNode) => (
  <EllipsisTooltip content={<S.TooltipText>{full}</S.TooltipText>}>{node}</EllipsisTooltip>
);

export const RealmsSummary = () => {
  const { getUrlWithNetwork } = useNetwork();
  const query = useGetSummaryRealms();
  const summary = query.data?.data;

  const builders = (summary?.builders ?? []).slice(0, 3).map(builder => ({
    key: builder.address,
    href: getUrlWithNetwork(`/account/${builder.address}`),
    title: withFullText(builder.address, textEllipsis(builder.address, 8)),
    subtitle: withFullText(builder.namespace, <PathText path={stripGnoLandPrefix(builder.namespace)} />),
    value: makeDisplayNumber(builder.deploys7d),
    badge: toBuilderBadge(builder.deploys7d, builder.deploysPrev7d),
  }));

  const mostCalled = (summary?.mostCalled ?? []).slice(0, 3).map(realm => ({
    key: realm.path,
    href: getUrlWithNetwork(realmUrl(realm.path)),
    title: withFullText(realm.path, <PathText path={stripGnoLandPrefix(realm.path)} />),
    subtitle: countLabel(realm.uniqueCallers24h, "caller"),
    value: makeDisplayNumber(realm.calls24h),
    badge: toPctBadge(realm.deltaPct),
  }));

  const calls = summary?.calls;
  const storage = summary?.storage;
  const net = storage ? storage.locked24h - storage.released24h : undefined;
  const bytes = storage ? formatBytes(storage.bytesDelta24h) : undefined;
  const lockedShare = storage ? (storage.locked24h / (storage.locked24h + storage.released24h || 1)) * 100 : 0;

  return (
    <SummaryGrid>
      <SummaryCard
        title="Builders · 7d"
        live
        footer={`Deploys · ${summary ? countLabel(summary.publishers7d, "publisher") : "- publishers"} in 7 days`}
      >
        <SummaryRows
          rows={builders}
          isFetched={query.isFetched}
          isError={query.isError}
          emptyText="No deploys in the last 7 days"
          ranked
        />
      </SummaryCard>
      <SummaryCard title="Most Called · 24h" footer="Calls · vs previous 24h">
        <SummaryRows
          rows={mostCalled}
          isFetched={query.isFetched}
          isError={query.isError}
          emptyText="No realm calls in the last 24h"
          ranked
        />
      </SummaryCard>
      <SummaryCard
        title="Calls · 24h"
        footer={[
          "Last 7 days",
          calls && countLabel(calls.uniqueCallers24h, "caller"),
          calls && countLabel(calls.realmsTouched24h, "realm"),
        ]
          .filter(Boolean)
          .join(" · ")}
      >
        <SummaryBigNumber
          value={calls?.calls24h}
          isFetched={query.isFetched}
          badge={toPctBadge(calls?.deltaPct, " vs previous 24h")}
        />
        <SummaryBars
          label="Realm calls per 24h, last 7 days"
          periods={calls?.daily ?? []}
          series={[{ color: "blue", values: calls?.daily.map(day => day.count) ?? [] }]}
        />
      </SummaryCard>
      <SummaryCard
        title="Storage · 24h"
        footer={
          storage && net !== undefined && bytes
            ? `Net ${signedGnot(net)} GNOT · ${storage.bytesDelta24h >= 0 ? "+" : "-"}${bytes.value} ${
                bytes.unit
              } on-chain`
            : undefined
        }
      >
        {query.isFetched ? (
          <S.StorageAmounts>
            <div>
              <Text type="h3" color="blue">
                {storage ? `+${formatGnot(storage.locked24h)}` : "-"}
              </Text>
              <Text type="body1" color="tertiary">
                GNOT locked
              </Text>
            </div>
            <div>
              <Text type="h3" color="orange">
                {storage ? `-${formatGnot(storage.released24h)}` : "-"}
              </Text>
              <Text type="body1" color="tertiary">
                GNOT released
              </Text>
            </div>
          </S.StorageAmounts>
        ) : (
          <SkeletonBar width={160} height={44} />
        )}
        {storage && (
          <S.StorageShare aria-hidden="true">
            <span style={{ width: `${lockedShare}%` }} />
          </S.StorageShare>
        )}
        <SummaryFacts
          facts={[
            {
              label: "Largest realm",
              value: storage?.largestRealm ? (
                <Link href={getUrlWithNetwork(realmUrl(storage.largestRealm.path))}>
                  <Text type="p4" color="blue">
                    {`${displayPath(storage.largestRealm.path)} · ${formatGnot(storage.largestRealm.depositGnot)}`}
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
