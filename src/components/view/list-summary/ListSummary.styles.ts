import Link from "next/link";
import styled, { keyframes } from "styled-components";

import { media } from "@/common/values/ui.constant";

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

    // The Recently card holds a list, so it takes the full first row.
    & > :first-child {
      grid-column: 1 / -1;
    }
  }
`;

export const Card = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
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
`;

export const CardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
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

export const Items = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

export const Featured = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding-bottom: 6px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.dimmed50};
`;

export const Media = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;

  img,
  svg {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const FeaturedText = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const Row = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;

  .row-meta {
    flex-shrink: 0;
  }
`;

export const Count = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const SearchBox = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 40px;
  padding: 0 16px;
  border: 1px solid ${({ theme }) => theme.colors.dimmed50};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.base};

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
