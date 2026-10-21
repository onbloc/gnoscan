import React from "react";
import styled from "styled-components";

import mixins from "@/styles/mixins";
import theme from "@/styles/theme";
import IconFirstPage from "@/assets/svgs/icon-pagination-first.svg";
import IconPreviousPage from "@/assets/svgs/icon-pagination-previous.svg";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChangePage: (page: number) => void;
  hasNext?: boolean;
  allowLastPage?: boolean;
  hideFirstPageButtonWhenDisabled?: boolean;
  hideLastPageButtonWhenCurrent?: boolean;
}

export const Pagination = ({
  page,
  totalPages,
  onChangePage,
  hasNext,
  allowLastPage = true,
  hideFirstPageButtonWhenDisabled = false,
  hideLastPageButtonWhenCurrent = false,
}: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const hasPrev = page > 1;
  const canGoNext = page < totalPages && (hasNext ?? true);
  const canGoLast = allowLastPage && canGoNext;

  return (
    <Wrapper>
      {!(hideFirstPageButtonWhenDisabled && !hasPrev) && (
        <ArrowButton aria-label="First page" disabled={!hasPrev} onClick={() => hasPrev && onChangePage(1)}>
          <IconFirstPage />
        </ArrowButton>
      )}
      <ArrowButton aria-label="Previous page" disabled={!hasPrev} onClick={() => hasPrev && onChangePage(page - 1)}>
        <IconPreviousPage />
      </ArrowButton>
      <PageText>{`Page ${page} of ${totalPages}`}</PageText>
      <ArrowButton aria-label="Next page" disabled={!canGoNext} onClick={() => canGoNext && onChangePage(page + 1)}>
        <IconPreviousPage className="icon-arrow-right" />
      </ArrowButton>
      {!(hideLastPageButtonWhenCurrent && page === totalPages) && (
        <ArrowButton aria-label="Last page" disabled={!canGoLast} onClick={() => canGoLast && onChangePage(totalPages)}>
          <IconFirstPage className="icon-arrow-right" />
        </ArrowButton>
      )}
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
    width: 16px;
    height: 16px;

    path {
      stroke: ${({ theme }) => theme.colors.reverse};
    }

    &.icon-arrow-right {
      transform: rotate(180deg);
    }
  }
`;
