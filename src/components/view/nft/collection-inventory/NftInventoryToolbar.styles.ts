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
  max-width: 220px;

  > span {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.primary};
    pointer-events: none;
  }
`;

export const OwnerSelect = styled.select`
  appearance: none;
  height: 38px;
  max-width: 100%;
  padding: 0 30px 0 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.nftCardBorder};
  border-radius: 8px;
  cursor: pointer;
  text-overflow: ellipsis;

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue};
    outline-offset: 2px;
  }
`;

export const SortButton = styled.button`
  flex: 0 0 auto;
  height: 38px;
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
