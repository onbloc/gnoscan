import React from "react";

import { makeDisplayNumber } from "@/common/utils/string-util";
import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";
import Text from "@/components/ui/text";
import * as S from "./ListSummary.styles";

export const SummaryGrid = S.Grid;

interface SummaryCardProps {
  title: string;
  // Shows a pulsing dot next to the title for cards fed by recent on-chain activity.
  live?: boolean;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const SummaryCard = ({ title, live, footer, children }: SummaryCardProps) => (
  <S.Card>
    <S.CardTitle>
      <Text type="p4" color="tertiary">
        {title}
      </Text>
      {live && <S.LiveDot aria-label="Live" />}
    </S.CardTitle>
    <S.CardBody>{children}</S.CardBody>
    {footer && (
      <Text type="body1" color="tertiary" className="card-footer">
        {footer}
      </Text>
    )}
  </S.Card>
);

export type DeltaTone = "up" | "down";

export interface DeltaBadgeData {
  label: string;
  tone: DeltaTone;
}

const signed = (value: number) => `${value > 0 ? "+" : value < 0 ? "-" : ""}${Math.abs(value)}`;

/**
 * Badge for a change against the previous window. Null deltaPct means the previous window was empty, shown as
 * "new". Undefined means there is no value yet, and a zero change is hidden so a quiet day does not read as a dead chain.
 */
export const toPctBadge = (deltaPct: number | null | undefined, suffix = ""): DeltaBadgeData | undefined => {
  if (deltaPct === undefined) return undefined;
  if (deltaPct === null) return { label: "new", tone: "up" };
  // Checked after rounding so a change like 0.04 reads as no change instead of "0%".
  const rounded = Number(deltaPct.toFixed(1));
  if (rounded === 0) return undefined;
  return { label: `${signed(rounded)}%${suffix}`, tone: rounded > 0 ? "up" : "down" };
};

export const toCountBadge = (delta: number | undefined, suffix = ""): DeltaBadgeData | undefined => {
  if (!delta) return undefined;
  return { label: `${signed(delta)}${suffix}`, tone: delta > 0 ? "up" : "down" };
};

export const DeltaBadge = ({ badge }: { badge?: DeltaBadgeData }) =>
  badge ? <S.Badge $tone={badge.tone}>{badge.label}</S.Badge> : null;

// "-" when the request failed, so the card keeps its layout while the API is unavailable.
export const SummaryBigNumber = ({
  value,
  isFetched,
  badge,
}: {
  value?: number;
  isFetched: boolean;
  badge?: DeltaBadgeData;
}) =>
  isFetched ? (
    <S.BigNumber>
      <Text type="h3" color="primary">
        {value === undefined ? "-" : makeDisplayNumber(value)}
      </Text>
      <DeltaBadge badge={badge} />
    </S.BigNumber>
  ) : (
    <SkeletonBar width={120} height={28} />
  );

export type BarColor = "blue" | "orange";

/** 7 daily bars, oldest first. Series are stacked bottom up and today's bar is drawn at full strength. */
export const SummaryBars = ({ series, label }: { series: { color: BarColor; values: number[] }[]; label: string }) => {
  const days = series[0]?.values.length ?? 0;
  if (days === 0) return null;

  const totals = Array.from({ length: days }, (_, day) => series.reduce((sum, s) => sum + (s.values[day] ?? 0), 0));
  const max = Math.max(...totals, 1);

  return (
    <S.Bars role="img" aria-label={label}>
      {totals.map((total, day) => (
        <S.BarColumn key={day} style={{ height: `${(total / max) * 100}%` }} $today={day === days - 1}>
          {series.map(({ color, values }) => (
            <S.BarSegment key={color} $color={color} style={{ flexGrow: values[day] ?? 0 }} />
          ))}
        </S.BarColumn>
      ))}
    </S.Bars>
  );
};

export const SummaryLegendDot = ({ color }: { color: BarColor }) => <S.LegendDot $color={color} />;

export interface SummaryRowData {
  key: string;
  href: string;
  title: string;
  subtitle?: string;
  // Logo or artwork before the title.
  media?: React.ReactNode;
  // Right side: a time, or a count with its change.
  value?: string;
  badge?: DeltaBadgeData;
}

/** Up to three rows, numbered when ranked. Shows skeletons while loading and emptyText when there are none. */
export const SummaryRows = ({
  rows,
  isFetched,
  emptyText,
  ranked,
}: {
  rows: SummaryRowData[];
  isFetched: boolean;
  emptyText: string;
  ranked?: boolean;
}) => {
  if (!isFetched) {
    return (
      <S.Rows>
        {[0, 1, 2].map(index => (
          <SkeletonBar key={index} width={180} height={36} />
        ))}
      </S.Rows>
    );
  }

  if (rows.length === 0) {
    return (
      <Text type="p4" color="tertiary">
        {emptyText}
      </Text>
    );
  }

  return (
    <S.Rows>
      {rows.map((row, index) => (
        <S.Row key={row.key} href={row.href}>
          {ranked && (
            <Text type="body1" color="tertiary" className="row-rank">
              {index + 1}
            </Text>
          )}
          {row.media && <S.Media>{row.media}</S.Media>}
          <S.RowText>
            <Text type="p4" color="blue" className="ellipsis">
              {row.title}
            </Text>
            {row.subtitle && (
              <Text type="body1" color="tertiary" className="ellipsis">
                {row.subtitle}
              </Text>
            )}
          </S.RowText>
          {row.value && (
            <Text type="p4" color={row.badge ? "primary" : "tertiary"} className="row-value">
              {row.value}
            </Text>
          )}
          <DeltaBadge badge={row.badge} />
        </S.Row>
      ))}
    </S.Rows>
  );
};

/** Label on the left, value or link on the right, under a divider. */
export const SummaryFacts = ({ facts }: { facts: { label: string; value: React.ReactNode }[] }) => (
  <S.Facts>
    {facts.map(({ label, value }) => (
      <S.Fact key={label}>
        <Text type="body1" color="tertiary">
          {label}
        </Text>
        {value}
      </S.Fact>
    ))}
  </S.Facts>
);
