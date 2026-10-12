import Link from "next/link";
import styled from "styled-components";

import { media } from "@/common/values/ui.constant";
import { ViewMoreButton as SharedViewMoreButton } from "@/components/ui/button/view-more-button";
import Text from "@/components/ui/text";

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.base};
  border-radius: 10px;

  ${media.DESKTOP} {
    padding: 24px;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const CountPill = styled(Text)`
  padding: 4px 10px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 100px;
`;

export const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
`;

// Figma: P4 (14/20) primary label on every chip; the selected chip is bold, like the active detail tab
export const Chip = styled.button<{ selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  ${({ theme }) => theme.fonts.p4};
  font-weight: ${({ selected }) => (selected ? 600 : 400)};
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 0;
  border-radius: 100px;
  cursor: pointer;
`;

// Reserves the bold label width so selecting a chip does not shift its neighbors
export const ChipLabel = styled.span`
  display: inline-flex;
  flex-direction: column;

  ::after {
    content: attr(data-label);
    height: 0;
    overflow: hidden;
    font-weight: 600;
    visibility: hidden;
  }
`;

export const ChipCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 21px;
  height: 18px;
  padding: 0 4px;
  ${({ theme }) => theme.fonts.body1};
  line-height: 18px;
  background-color: ${({ theme }) => theme.colors.base};
  border-radius: 100px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  width: 100%;

  ${media.TABLET} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  ${media.DESKTOP} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }
`;

// Positioned at the cursor by floating-ui
export const Tooltip = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: max-content;
  min-width: 222px;
  max-width: 280px;
  padding: 10px 10px 7px;
  background-color: #0e0e0e;
  border: 1px solid #3a3a3a;
  border-radius: 6px;
  pointer-events: none;
`;

// Hover/tooltip target; the card link and the gno.web link are layered inside it
export const CardItem = styled.div`
  position: relative;
  display: flex;
  min-width: 0;
`;

// Covers the whole card; the gno.web link is raised above it
export const CardLink = styled(Link)`
  position: absolute;
  inset: 0;
  border-radius: 10px;
`;

export const TooltipTitle = styled.span`
  font-size: 12px;
  font-weight: 700;
  line-height: 14px;
  color: #ffffff;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const TooltipDetail = styled.span`
  font-size: 11px;
  line-height: 13px;
  color: #a5a5a5;
  white-space: pre;
`;

export const TooltipHint = styled.span`
  margin-top: 1px;
  font-size: 11px;
  line-height: 13px;
  color: #4f9cff;
`;

// Hugs its label (96px side padding), sits one grid gap below the cards and uses a SemiBold
// label, per the design
export const ViewMoreButton = styled(SharedViewMoreButton)`
  && {
    margin-top: 0;
  }

  && > * {
    font-weight: 600;
  }

  ${media.DESKTOP} {
    && {
      width: fit-content;
      padding: 0 96px;
    }
  }
`;

export const CollectionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
`;

// Rendered as the gno.web link when the network has one; raised above the stretched card link
export const CollectionPath = styled.span`
  position: relative;
  z-index: 1;
  display: flex;
  flex: 0 1 auto;
  align-items: center;
  gap: 5px;
  min-width: 0;
  transition: opacity 0.2s;

  &[href]:hover {
    opacity: 0.6;
  }

  ${media.MOBILE} {
    display: none;
  }

  .icon-link {
    flex: 0 0 16px;
    width: 16px;
    height: 16px;

    * {
      stroke: ${({ theme }) => theme.colors.gray300};
    }
  }
`;

// Truncates from the start so the trailing package name stays visible: the RTL box puts the
// ellipsis on the left while the <bdi> keeps the path itself left-to-right.
export const CollectionPathText = styled(Text)`
  min-width: 0;
  line-height: 24px;
  direction: rtl;
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const CollectionName = styled(Text)`
  flex: 0 0 auto;
  max-width: 50%;
  line-height: 24px;
  text-align: right;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  ${media.MOBILE} {
    flex: 1 1 auto;
    max-width: 100%;
    text-align: left;
  }
`;

export const SkeletonImage = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
`;
