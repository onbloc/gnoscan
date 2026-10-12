import styled from "styled-components";

import { formatPriceChange } from "@/common/utils/price.utility";

// Token list and token details design colors, not part of the theme palette.
const PRICE_UP_COLOR = "#0DBE89";
const PRICE_DOWN_COLOR = "#EF2D21";

/** Renders "+15.25%" in the design's rise or fall color; renders nothing without a 24h change. */
export const PriceChangeText = ({ change }: { change: number | null | undefined }) => {
  if (change === null || change === undefined) return null;
  return <ChangeText $up={change >= 0}>{formatPriceChange(change)}</ChangeText>;
};

const ChangeText = styled.span<{ $up: boolean }>`
  margin-left: 4px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  line-height: 100%;
  white-space: nowrap;
  color: ${({ $up }) => ($up ? PRICE_UP_COLOR : PRICE_DOWN_COLOR)};
`;
