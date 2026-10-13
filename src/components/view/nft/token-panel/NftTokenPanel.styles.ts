import styled from "styled-components";

import { media } from "@/common/values/ui.constant";
import { zindex } from "@/common/values/z-index";

const PANEL_TOP_OFFSET = 24;

// Desktop: sticks beside the inventory grid. Below desktop: a bottom sheet over the page.
export const Panel = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.nftPanel};
  border: 1px solid ${({ theme }) => theme.colors.nftPanelBorder};
  border-radius: 16px;

  ${media.DESKTOP} {
    position: sticky;
    top: ${PANEL_TOP_OFFSET}px;
    max-height: calc(100vh - ${PANEL_TOP_OFFSET * 2}px);
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
    border-radius: 16px 16px 0 0;
    box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.2);
  }
`;

export const Backdrop = styled.div`
  display: none;

  ${media.NOT_DESKTOP} {
    position: fixed;
    inset: 0;
    z-index: ${zindex.modal};
    display: block;
    background-color: ${({ theme }) => theme.colors.dimmed600};
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

  :disabled {
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
`;

export const Rows = styled.dl`
  display: flex;
  flex-direction: column;
`;

export const Row = styled.div<{ compact?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: ${({ compact }) => (compact ? 35 : 41)}px;
  padding: 4px 0;
  font-size: ${({ compact }) => (compact ? 11 : 14)}px;
  line-height: 24px;

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.dimmed100};
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
    color: ${({ theme }) => theme.colors.primary};
    text-align: right;
  }

  a {
    overflow: hidden;
    color: ${({ theme }) => theme.colors.blue};
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .copy-icon {
    width: 14px;
    height: 14px;
    stroke: ${({ theme }) => theme.colors.primary};
  }
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const SectionTitle = styled.h4`
  font-size: 11px;
  font-weight: 400;
  line-height: 13px;
  color: ${({ theme }) => theme.colors.tertiary};
  text-transform: uppercase;
`;

export const EmptyText = styled.p`
  font-size: 11px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.tertiary};
`;

export const CopyUrlButton = styled.button`
  width: 100%;
  height: 34px;
  ${({ theme }) => theme.fonts.p4};
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.dimmed100};
  border-radius: 4px;
  cursor: pointer;
`;

export const Attributes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Attribute = styled.dl`
  min-width: 0;
  padding: 6px 12px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.nftPanelBorder};
  border-radius: 8px;
  dt {
    font-size: 10px;
    line-height: 13px;
    color: ${({ theme }) => theme.colors.tertiary};
    text-transform: uppercase;
  }
  dd {
    font-size: 12px;
    line-height: 16px;
    color: ${({ theme }) => theme.colors.primary};
    overflow-wrap: anywhere;
  }
`;

export const RetryButton = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.blue};
  font: inherit;
  cursor: pointer;
`;
