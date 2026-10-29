import Link from "next/link";
import styled, { keyframes } from "styled-components";

import { media } from "@/common/values/ui.constant";
import { SearchBox as InventorySearchBox } from "@/components/view/nft/collection-inventory/NftInventoryToolbar.styles";

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  width: 100%;

  ${media.TABLET} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.MOBILE} {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    // The Recently and Trending cards hold lists, so each takes a full row and the two number cards share one.
    & > :nth-child(-n + 2) {
      grid-column: 1 / -1;
    }
  }
`;

export const Card = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.dimmed50};
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.base};

  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  // Footers line up across the row of cards.
  .card-footer {
    margin-top: auto;
  }
`;

export const CardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 197, 154, 0.6); }
  70% { box-shadow: 0 0 0 6px rgba(0, 197, 154, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 197, 154, 0); }
`;

export const LiveDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.green};
  animation: ${pulse} 2s infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Badge = styled.span<{ $tone: "up" | "down" }>`
  ${({ theme }) => theme.fonts.body2};
  flex-shrink: 0;
  padding: 2px 6px;
  border-radius: 6px;
  font-weight: 700;
  white-space: nowrap;
  color: ${({ $tone, theme }) => ($tone === "up" ? theme.colors.green : theme.colors.failed)};
  background-color: ${({ $tone }) => ($tone === "up" ? "rgba(0, 197, 154, 0.12)" : "rgba(255, 77, 79, 0.12)")};
`;

export const BigNumber = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 10px;
`;

export const BarsArea = styled.div`
  position: relative;
  min-height: 64px;
`;

export const Bars = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 64px;
`;

// Full height hover target, so short bars are as easy to point at as tall ones.
export const BarSlot = styled.div`
  display: flex;
  flex: 1;
  align-items: flex-end;
  height: 100%;
  cursor: default;
  outline: none;

  &:hover > div,
  &:focus-visible > div {
    opacity: 1;
  }
`;

// Bars keep a linear height, with a floor that tells a small count apart from none next to a much larger day.
export const BarColumn = styled.div<{ $today: boolean; $empty: boolean }>`
  display: flex;
  flex: 1;
  flex-direction: column-reverse;
  min-height: ${({ $empty }) => ($empty ? 2 : 4)}px;
  overflow: hidden;
  border-radius: 2px;
  // Earlier days are faded so today's bar stands out.
  opacity: ${({ $today }) => ($today ? 1 : 0.3)};
`;

export const BarTooltip = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  z-index: 1;
  pointer-events: none;
  white-space: nowrap;
`;

export const BarSegment = styled.div<{ $color: "blue" | "orange" }>`
  flex-basis: 0;
  background-color: ${({ $color, theme }) => theme.colors[$color]};
`;

export const LegendDot = styled.span<{ $color: "blue" | "orange" }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  margin: 0 4px 0 8px;
  border-radius: 2px;
  background-color: ${({ $color, theme }) => theme.colors[$color]};
`;

export const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
`;

export const Row = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;

  .row-rank {
    flex-shrink: 0;
    width: 12px;
  }

  .row-value {
    flex-shrink: 0;
    margin-left: auto;
  }
`;

export const RowMain = styled(Link)`
  display: flex;
  flex: 1;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

export const RowText = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

export const Media = styled.div`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;

  img,
  svg {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// A token logo before its name in a fact value.
export const FactToken = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-width: 0;

  img,
  svg {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }
`;

// Keeps a full address or path on one line in its tooltip.
export const TooltipText = styled.span`
  white-space: nowrap;
`;

export const Facts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.dimmed50};
`;

export const Fact = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;

  & > :last-child {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const Tiles = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`;

export const Tile = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;

  & > :first-child {
    margin-bottom: 6px;
    border-radius: 8px;
  }
`;

export const StorageAmounts = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
`;

// Locked share of the storage moved in 24h, released fills the rest.
export const StorageShare = styled.div`
  height: 6px;
  overflow: hidden;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.colors.orange};

  span {
    display: block;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.blue};
  }
`;

// The collection inventory search box, on the base color so it stands out on the list page surface.
export const SearchBox = styled(InventorySearchBox)`
  border: 1px solid ${({ theme }) => theme.colors.dimmed50};
  background-color: ${({ theme }) => theme.colors.base};
`;
