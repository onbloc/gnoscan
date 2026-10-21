import React from "react";

import { makeDisplayNumber } from "@/common/utils/string-util";
import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";
import Text from "@/components/ui/text";
import * as S from "./ListSummary.styles";

export const SummaryGrid = S.Grid;

interface SummaryCardProps {
  title: string;
  caption?: string;
  // Shows a pulsing dot next to the title for cards fed by recent on-chain activity.
  live?: boolean;
  children: React.ReactNode;
}

export const SummaryCard = ({ title, caption, live, children }: SummaryCardProps) => (
  <S.Card>
    <S.CardTitle>
      <Text type="p4" color="tertiary">
        {title}
      </Text>
      {live && <S.LiveDot aria-label="Live" />}
    </S.CardTitle>
    {children}
    {caption && (
      <Text type="body1" color="tertiary">
        {caption}
      </Text>
    )}
  </S.Card>
);

// "-" when the request failed, so the card keeps its layout while the API is unavailable.
export const SummaryValue = ({ value, isFetched }: { value?: number; isFetched: boolean }) =>
  isFetched ? (
    <Text type="h3" color="primary">
      {value === undefined ? "-" : makeDisplayNumber(value)}
    </Text>
  ) : (
    <SkeletonBar width={100} height={28} />
  );

export interface SummaryItemData {
  key: string;
  href: string;
  title: string;
  // Second line of the featured item, middle column of the rows.
  subtitle?: string;
  meta?: string;
  // Logo or artwork, shown only on the featured item.
  media?: React.ReactNode;
}

// Featured first item followed by compact rows, used by the Recently and Trending cards.
export const SummaryItemList = ({
  items,
  isFetched,
  emptyText,
}: {
  items: SummaryItemData[];
  isFetched: boolean;
  emptyText: string;
}) => {
  if (!isFetched) {
    return (
      <S.Items>
        <SkeletonBar width={160} height={40} />
        <SkeletonBar width={140} height={16} />
        <SkeletonBar width={140} height={16} />
      </S.Items>
    );
  }

  if (items.length === 0) {
    return (
      <Text type="p4" color="tertiary">
        {emptyText}
      </Text>
    );
  }

  const [featured, ...rest] = items;

  return (
    <S.Items>
      <S.Featured href={featured.href}>
        {featured.media && <S.Media>{featured.media}</S.Media>}
        <S.FeaturedText>
          <Text type="p4" color="blue" className="ellipsis">
            {featured.title}
          </Text>
          <Text type="body1" color="tertiary" className="ellipsis">
            {[featured.subtitle, featured.meta].filter(Boolean).join(" · ")}
          </Text>
        </S.FeaturedText>
      </S.Featured>
      {rest.map(item => (
        <S.Row key={item.key} href={item.href}>
          <Text type="body1" color="blue" className="ellipsis">
            {item.title}
          </Text>
          <Text type="body1" color="tertiary" className="ellipsis">
            {item.subtitle}
          </Text>
          <Text type="body1" color="tertiary" className="row-meta">
            {item.meta}
          </Text>
        </S.Row>
      ))}
    </S.Items>
  );
};
