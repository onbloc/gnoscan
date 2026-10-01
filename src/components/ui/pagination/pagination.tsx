import React from "react";
import styled from "styled-components";

import mixins from "@/styles/mixins";
import theme from "@/styles/theme";
import IconArrow from "@/assets/svgs/icon-arrow.svg";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChangePage: (page: number) => void;
  hasNext?: boolean;
  allowLastPage?: boolean;
}

export const Pagination = ({ page, totalPages, onChangePage, hasNext, allowLastPage = true }: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const hasPrev = page > 1;
  const canGoNext = page < totalPages && (hasNext ?? true);
  const canGoLast = allowLastPage && canGoNext;

  return (
    <Wrapper>
      <ArrowButton aria-label="First page" disabled={!hasPrev} onClick={() => hasPrev && onChangePage(1)}>
        <DoubleArrow className="icon-arrow-left">
          <IconArrow />
          <IconArrow />
        </DoubleArrow>
      </ArrowButton>
      <ArrowButton aria-label="Previous page" disabled={!hasPrev} onClick={() => hasPrev && onChangePage(page - 1)}>
        <IconArrow className="icon-arrow-left" />
      </ArrowButton>
      <PageText>{`Page ${page} of ${totalPages}`}</PageText>
      <ArrowButton aria-label="Next page" disabled={!canGoNext} onClick={() => canGoNext && onChangePage(page + 1)}>
        <IconArrow />
      </ArrowButton>
      <ArrowButton aria-label="Last page" disabled={!canGoLast} onClick={() => canGoLast && onChangePage(totalPages)}>
        <DoubleArrow>
          <IconArrow />
          <IconArrow />
        </DoubleArrow>
      </ArrowButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  ${mixins.flexbox("row", "center", "center", false)};
  gap: 12px;
  width: 100%;
  height: 66px;
  padding: 10px 24px;
`;

const PageText = styled.span`
  ${theme.fonts.p4};
  color: ${({ theme }) => theme.colors.primary};
  white-space: nowrap;
`;

const ArrowButton = styled.button<{ disabled?: boolean }>`
  ${mixins.flexbox("row", "center", "center")};
  width: 30px;
  height: 30px;
  padding: 7px;
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.colors.surface};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};

  svg {
    fill: ${({ theme }) => theme.colors.reverse};

    &.icon-arrow-left {
      transform: rotate(180deg);
    }
  }
`;

const DoubleArrow = styled.span`
  display: flex;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;

  svg {
    width: 10px;
    height: 16px;

    + svg {
      margin-left: -6px;
    }
  }
`;
