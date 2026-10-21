import styled from "styled-components";

import { media } from "@/common/values/ui.constant";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 1146px;
  align-self: center;

  ${media.DESKTOP} {
    /* DetailsContainer's tab-area leaves 16px; Figma spec is 24px from tabs to toolbar. */
    margin-top: 8px;
  }
`;

export const Grid = styled.div`
  position: relative;
  display: grid;
  align-items: start;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  width: 100%;
  max-width: 1144px;

  ${media.TABLET} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  ${media.DESKTOP} {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
`;

// Expanded pages show 12 cards beside the panel and two full five-card rows below.
export const PanelSlot = styled.div`
  min-width: 0;
  align-self: stretch;
  ${media.DESKTOP} {
    grid-column: 4 / span 2;
    grid-row: 1 / span 4;
    /* Figma's 450px panel extends 2px beyond the last 216px card edge. */
    margin-right: -2px;
  }
  ${media.NOT_DESKTOP} {
    display: contents;
  }
`;

export const EmptyState = styled.div`
  grid-column: 1 / -1;
`;

export const CardItem = styled.div`
  position: relative;
  display: flex;
  min-width: 0;
  scroll-margin: 96px;
`;

// Covers the whole card; the owner link and copy icon are raised above it
export const CardButton = styled.button`
  position: absolute;
  inset: 0;
  padding: 0;
  border: 0;
  background: none;
  border-radius: 10px;
  cursor: pointer;

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue};
    outline-offset: 2px;
  }
`;

export const OwnerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  ${({ theme }) => theme.fonts.body1};
  line-height: 24px;

  > span {
    flex: 0 0 auto;
    color: ${({ theme }) => theme.colors.tertiary};
  }

  /* Keep the inventory owner text flush with its copy button. */
  > div {
    gap: 0;
  }

  a {
    color: ${({ theme }) => theme.colors.blue};
  }

  a,
  .copy-tooltip {
    position: relative;
    z-index: 1;
  }
`;
