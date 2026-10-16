import styled from "styled-components";

import { media } from "@/common/values/ui.constant";
import { zindex } from "@/common/values/z-index";

// Figma 6565:14833: 450 × 1104px desktop box with a 16px content inset.
// Extra content scrolls inside the box; below desktop it remains a bottom sheet.
export const Panel = styled.aside<{ $visible: boolean; $interactive: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.nftPanel};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.nftPanelBorder};
  border-radius: 16px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? "visible" : "hidden")};
  pointer-events: ${({ $interactive }) => ($interactive ? "auto" : "none")};
  transform: ${({ $visible }) => ($visible ? "translateY(0)" : "translateY(12px)")};
  transition: opacity 0.4s ease, transform 0.4s ease, visibility 0s ${({ $visible }) => ($visible ? "0s" : "0.4s")};

  > * {
    flex-shrink: 0;
  }

  // Keep the same artwork corners when the shared image falls back.
  .token-artwork {
    border-radius: 8px;
  }

  ${media.DESKTOP} {
    width: 450px;
    height: 1104px;
    overflow-y: auto;
  }

  ${media.NOT_DESKTOP} {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: ${zindex.modal};
    max-height: 85vh;
    overflow-y: auto;
    overscroll-behavior: contain;
    border-radius: 16px 16px 0 0;
    box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.2);
    transform: ${({ $visible }) => ($visible ? "translateY(0)" : "translateY(100%)")};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Backdrop = styled.div<{ $visible: boolean; $interactive: boolean }>`
  display: none;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? "visible" : "hidden")};
  pointer-events: ${({ $interactive }) => ($interactive ? "auto" : "none")};
  transition: opacity 0.4s ease, visibility 0s ${({ $visible }) => ($visible ? "0s" : "0.4s")};

  ${media.NOT_DESKTOP} {
    position: fixed;
    touch-action: none;
    inset: 0;
    z-index: ${zindex.modal};
    display: block;
    background-color: ${({ theme }) => theme.colors.dimmed600};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const HeaderButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export const IconButton = styled.button`
  display: flex;
  flex: 0 0 32px;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.dimmed100};
  border-radius: 2px;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }

  .icon-fill * {
    fill: ${({ theme }) => theme.colors.primary};
  }

  .icon-stroke path {
    stroke: ${({ theme }) => theme.colors.primary};
  }

  .icon-previous {
    transform: rotate(180deg);
  }

  /* 24px asset; svgr drops the viewBox, so scale instead of resizing */
  .icon-close {
    flex: 0 0 24px;
    transform: scale(0.67);
  }
`;

export const TitleArea = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

export const Title = styled.h3`
  overflow: hidden;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.primary};
  white-space: nowrap;
  text-overflow: ellipsis;

  ${media.DESKTOP} {
    font-size: 17px;
  }
`;

export const SymbolBadge = styled.span`
  flex: 0 0 auto;
  height: 24px;
  padding: 2px 10px;
  ${({ theme }) => theme.fonts.body1};
  line-height: 20px;
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.nftBadge};
  border-radius: 10px;

  ${media.DESKTOP} {
    font-size: 13px;
  }
`;

export const Rows = styled.dl`
  display: flex;
  flex-direction: column;
`;

// One divider per row, owned by its border; padding and margin reproduce Figma's divider offsets.
export const Row = styled.div<{ compact?: boolean }>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-height: ${({ compact }) => (compact ? 30 : 33)}px;
  padding-bottom: ${({ compact }) => (compact ? 5 : 8)}px;
  margin-bottom: ${({ compact }) => (compact ? 5 : 8)}px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.dimmed100};
  font-size: ${({ compact }) => (compact ? 11 : 14)}px;
  line-height: 24px;

  &:last-child {
    min-height: 24px;
    padding-bottom: 0;
    margin-bottom: 0;
    border-bottom: 0;
  }

  dt {
    flex: 0 0 auto;
    color: ${({ theme }) => theme.colors.tertiary};
  }

  dd {
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 0;
    max-width: 72%;
    min-height: 24px;
    line-height: ${({ compact }) => (compact ? 13 : 20)}px;
    color: ${({ theme }) => theme.colors.primary};
    text-align: right;
    white-space: nowrap;

    > div {
      min-width: 0;
    }
  }

  a {
    overflow: hidden;
    color: ${({ theme }) => theme.colors.blue};
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .last-transfer-value {
    color: ${({ theme }) => theme.colors.nftPanelText};
    line-height: 16px;
  }

  .copy-icon,
  .svg-icon {
    width: 16px;
    height: 16px;
    margin: -1px;
    transform: scale(0.875);
    stroke: ${({ theme }) => theme.colors.primary};
  }

  ${media.DESKTOP} {
    font-size: ${({ compact }) => (compact ? 12 : 15)}px;
  }
`;

export const Section = styled.section<{ $variant: "attributes" | "history" | "technical" }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $variant }) => ($variant === "technical" ? 5 : 6)}px;
  margin-top: ${({ $variant }) => ($variant === "history" ? 0.5 : 8)}px;

  ${media.DESKTOP} {
    // The shared pagination label keeps its mobile typography.
    > div > span {
      font-size: 15px;
    }
  }
`;

export const SectionTitle = styled.h4<{ $attributes?: boolean }>`
  font-size: 11px;
  font-weight: 400;
  line-height: ${({ $attributes }) => ($attributes ? 13.1 : 13)}px;
  color: ${({ theme, $attributes }) => ($attributes ? theme.colors.tertiary : theme.colors.nftPanelMuted)};
  text-transform: uppercase;

  ${media.DESKTOP} {
    font-size: 12px;
  }
`;

export const EmptyText = styled.p`
  font-size: 11px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.tertiary};

  ${media.DESKTOP} {
    font-size: 12px;
  }
`;

export const RoyaltyValue = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;

  b {
    font-weight: 700;
  }
`;

export const TransferList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 0;
  list-style: none;
`;

export const TransferItem = styled.li`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 4px;
  min-width: 0;
  min-height: 30px;
  padding-bottom: 5px;
  margin-bottom: 5px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.dimmed100};
  font-size: 11px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.tertiary};

  &:last-child {
    min-height: 24px;
    padding-bottom: 0;
    margin-bottom: 0;
    border-bottom: 0;
  }

  ${media.DESKTOP} {
    font-size: 12px;
  }
`;

export const TransferDescription = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  gap: 4px;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;

  > .event-prefix {
    flex-shrink: 0;
  }

  b {
    font-weight: 700;
  }

  a {
    display: block;
    overflow: hidden;
    color: ${({ theme }) => theme.colors.blue};
    text-overflow: ellipsis;
  }
`;

export const TransferParty = styled.span<{ $hasLabel: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  flex-shrink: ${({ $hasLabel }) => ($hasLabel ? 1 : 0)};

  > div:last-child {
    flex-shrink: 0;
  }

  > div:first-child {
    min-width: 0;
  }

  .copy-icon {
    display: block;
    width: 16px;
    height: 16px;
    margin: -2px;
    transform: scale(0.75);
    stroke: ${({ theme }) => theme.colors.primary};
  }
`;

export const TransferMeta = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 4px;
  min-height: 24px;
  font-family: Inter, sans-serif;
  line-height: 13px;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.primary};

  * {
    font-family: Inter, sans-serif;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: ${({ theme }) => theme.colors.blue};
  }

  svg {
    width: 14px;
    height: 14px;
    stroke: ${({ theme }) => theme.colors.nftPanelIcon};
  }
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: auto;
`;

export const CopyUrlButton = styled.button`
  width: 100%;
  height: 35px;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.tertiary};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.nftPanelButtonBorder};
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.reverse};
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

// Match Figma's vertical spacing while sizing each trait to its text.
export const Attributes = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 7.5px;
`;

export const Attribute = styled.dl`
  flex: 0 1 auto;
  width: max-content;
  max-width: 100%;
  min-width: 0;
  padding: 7px 13px 3.3px;
  font-family: Inter, sans-serif;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.nftPanelBorder};
  border-radius: 8px;

  dt,
  dd {
    font-family: Inter, sans-serif;
  }
  dt {
    font-size: 10px;
    line-height: 12px;
    color: ${({ theme }) => theme.colors.tertiary};
    text-transform: uppercase;
    overflow-wrap: anywhere;
  }
  dd {
    margin-top: 1px;
    font-size: 12px;
    line-height: 15px;
    color: ${({ theme }) => theme.colors.primary};
    overflow-wrap: anywhere;
  }

  ${media.DESKTOP} {
    dt {
      font-size: 11px;
    }

    dd {
      font-size: 13px;
    }
  }
`;

// A value inside an Attribute box that opens a gnoswap page.
export const AttributeLink = styled.a`
  color: ${({ theme }) => theme.colors.blue};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

// GNFT Pool & Position Information only: three cells that fill one row in Figma's proportions (6565:14919,
// 144.8 : 87.8 : 170.4 of the 418px desktop panel) instead of boxes sized to their text. A cell never gets
// narrower than its content: a wider pool label takes its extra width from the other two cells, and only the
// narrowest screens wrap the row.
export const PositionBoxes = styled(Attributes)`
  flex-wrap: nowrap;
  max-width: 418px;

  ${media.MOBILE} {
    flex-wrap: wrap;
  }
`;

// `ratio` is the cell's share of the row width left after the two 7.5px gaps. A percentage basis is used because a
// zero basis still leaves the padding and border (28px) as the base size, which skews the proportions.
export const PositionBox = styled(Attribute)<{ $ratio: number }>`
  flex: 0 1 calc((100% - 15px) * ${({ $ratio }) => $ratio});
  width: auto;
  min-width: max-content;
`;

export const TokenUriButton = styled.button`
  max-width: min(250px, 60vw);
  padding: 0;
  border: 0;
  overflow: hidden;
  background: transparent;
  color: ${({ theme }) => theme.colors.blue};
  font: inherit;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
`;

export const RetryButton = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.blue};
  font: inherit;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;
