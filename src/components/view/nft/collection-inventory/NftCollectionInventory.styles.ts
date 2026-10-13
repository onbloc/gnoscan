import styled from "styled-components";

import { media } from "@/common/values/ui.constant";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 1146px;
  align-self: center;
`;

export const Grid = styled.div`
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

export const CardButton = styled.div`
  display: flex;
  min-width: 0;
  border-radius: 10px;
  cursor: pointer;
  scroll-margin: 96px;

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

  a {
    color: ${({ theme }) => theme.colors.blue};
  }
`;
