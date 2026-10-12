import styled from "styled-components";

import { media } from "@/common/values/ui.constant";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
`;

export const SearchBox = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  height: 40px;
  padding: 0 16px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  opacity: 0.6;

  ${media.NOT_MOBILE} {
    width: 398px;
  }

  input {
    flex: 1 1 auto;
    min-width: 0;
    ${({ theme }) => theme.fonts.p4};
    color: ${({ theme }) => theme.colors.primary};
    background: transparent;
    border: 0;
    outline: none;

    ::placeholder {
      color: ${({ theme }) => theme.colors.tertiary};
    }
  }

  svg {
    flex: 0 0 20px;
    width: 20px;
    height: 20px;
    stroke: ${({ theme }) => theme.colors.primary};
  }
`;

export const FilterButtons = styled.div`
  display: flex;
  gap: 10px;
`;

export const FilterButton = styled.button`
  height: 38px;
  padding: 0 12px 0 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.tertiary};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.nftCardBorder};
  border-radius: 8px;

  :disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

// Grid beside the token panel on desktop; the panel becomes a bottom sheet below desktop.
export const Body = styled.div<{ hasPanel: boolean }>`
  display: grid;
  grid-template-columns: ${({ hasPanel }) => (hasPanel ? "minmax(0, 1fr) 450px" : "minmax(0, 1fr)")};
  gap: 16px;
  align-items: start;
  width: 100%;

  ${media.NOT_DESKTOP} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Grid = styled.div<{ hasPanel: boolean }>`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  width: 100%;

  ${media.TABLET} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  ${media.DESKTOP} {
    grid-template-columns: repeat(${({ hasPanel }) => (hasPanel ? 3 : 5)}, minmax(0, 1fr));
  }
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

export const Sentinel = styled.div`
  width: 100%;
  height: 1px;
`;
