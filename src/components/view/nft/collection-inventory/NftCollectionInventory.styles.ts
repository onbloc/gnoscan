import styled from "styled-components";

import { media } from "@/common/values/ui.constant";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  width: 100%;

  ${media.TABLET} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  ${media.DESKTOP} {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
`;

// The Figma panel occupies the right two columns for four rows, not the whole list.
export const PanelSlot = styled.div`
  min-width: 0;
  ${media.DESKTOP} {
    grid-column: 4 / span 2;
    grid-row: 1 / span 4;
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
