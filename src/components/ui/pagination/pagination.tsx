import React from "react";
import styled from "styled-components";

import mixins from "@/styles/mixins";
import theme from "@/styles/theme";
import IconArrow from "@/assets/svgs/icon-arrow.svg";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}

export const Pagination = ({ page, totalPages, onChangePage }: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <Wrapper>
      <ArrowButton aria-label="Previous page" disabled={!hasPrev} onClick={() => hasPrev && onChangePage(page - 1)}>
        <IconArrow className="icon-arrow-right" />
      </ArrowButton>
      <PageText>{`Page ${page} of ${totalPages}`}</PageText>
      <ArrowButton aria-label="Next page" disabled={!hasNext} onClick={() => hasNext && onChangePage(page + 1)}>
        <IconArrow className="icon-arrow-left" />
      </ArrowButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  ${mixins.flexbox("row", "center", "center", false)};
  gap: 12px;
  width: 100%;
  padding: 10px 0;
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
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.colors.surface};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};

  svg {
    fill: ${({ theme }) => theme.colors.reverse};

    &.icon-arrow-right {
      transform: rotate(180deg);
    }
  }
`;
