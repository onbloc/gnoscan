import styled from "styled-components";

import { formatPriceChange } from "@/common/utils/price.utility";

/** Renders "+15.25%" like the main page GNOT price card; renders nothing without a 24h change. */
export const PriceChangeText = ({ change }: { change: number | null | undefined }) => {
  if (change === null || change === undefined) return null;
  return <ChangeText $up={change >= 0}>{formatPriceChange(change)}</ChangeText>;
};

const ChangeText = styled.span<{ $up: boolean }>`
  ${({ theme }) => theme.fonts.body2};
  margin-left: 6px;
  font-family: Inter, sans-serif;
  font-weight: 700;
  white-space: nowrap;
  color: ${({ $up, theme }) => ($up ? theme.colors.green : theme.colors.failed)};
`;
