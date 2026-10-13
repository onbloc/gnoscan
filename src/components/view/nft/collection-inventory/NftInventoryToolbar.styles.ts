import styled from "styled-components";

import { media } from "@/common/values/ui.constant";

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

  ${media.NOT_MOBILE} {
    width: 398px;
  }

  :focus-within {
    outline: 2px solid ${({ theme }) => theme.colors.blue};
    outline-offset: 2px;
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

    path {
      stroke: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export const FilterButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

export const OwnerControl = styled.div`
  position: relative;
  min-width: 0;
  width: 103.5px;
`;

export const OwnerMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 10;
  width: max-content;
  min-width: 100%;
  height: 280px;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => `${theme.colors.tertiary} ${theme.colors.surface}`};
  padding: 4px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.nftCardBorder};
  border-radius: 8px;

  ::-webkit-scrollbar {
    width: 8px;
    display: block;
  }

  ::-webkit-scrollbar-thumb {
    display: block;
    min-height: 24px;
    background-color: ${({ theme }) => theme.colors.tertiary};
    border: 2px solid ${({ theme }) => theme.colors.surface};
    border-radius: 8px;
  }

  ::-webkit-scrollbar-track {
    background-color: ${({ theme }) => theme.colors.surface};
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue};
    outline-offset: 2px;
  }
`;

export const OwnerOption = styled.div<{ $active: boolean }>`
  padding: 10px 12px;
  font-size: 13px;
  line-height: 20px;
  overflow-wrap: anywhere;
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme, $active }) => ($active ? theme.colors.select : "transparent")};
  border-radius: 4px;
  cursor: pointer;

  &[aria-selected="true"] {
    color: ${({ theme }) => theme.colors.blue};
  }

  :hover {
    background-color: ${({ theme }) => theme.colors.select};
  }
`;

export const OwnerButton = styled.button`
  height: 37.5px;
  width: 100%;
  padding: 0 24px 0 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.nftCardBorder};
  border-radius: 8px;
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: left;

  ::after {
    content: "▾";
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue};
    outline-offset: 2px;
  }
`;

export const SortButton = styled.button`
  flex: 0 0 auto;
  width: 96px;
  height: 37.5px;
  padding: 0 12px 0 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.nftCardBorder};
  border-radius: 8px;
  cursor: pointer;

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue};
    outline-offset: 2px;
  }
`;

export const Status = styled.span`
  flex-basis: 100%;
  ${({ theme }) => theme.fonts.p4};
  color: ${({ theme }) => theme.colors.tertiary};
`;
