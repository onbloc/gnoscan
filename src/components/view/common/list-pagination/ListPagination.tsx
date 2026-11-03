import React from "react";

import { Pagination } from "@/components/ui/pagination";

interface ListPaginationProps {
  page: number;
  pageSize: number;
  totalCount?: number;
  hasNext?: boolean;
  // False while rows of a previous query are shown, when totalCount may not match the page.
  isSettled: boolean;
  onChangePage: (page: number) => void;
}

export const ListPagination = ({
  page,
  pageSize,
  totalCount,
  hasNext,
  isSettled,
  onChangePage,
}: ListPaginationProps) => {
  const totalPages = Math.max(1, Math.ceil((totalCount ?? 0) / pageSize));

  // A saved page can exceed the current page count (e.g. rows removed, history restore).
  const isPastLastPage = isSettled && totalCount !== undefined && page > totalPages;
  React.useEffect(() => {
    if (isPastLastPage) onChangePage(totalPages);
  }, [isPastLastPage, totalPages, onChangePage]);

  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      hasNext={hasNext}
      hideFirstPageButtonWhenDisabled
      hideLastPageButtonWhenCurrent
      onChangePage={nextPage => onChangePage(Math.min(Math.max(nextPage, 1), totalPages))}
    />
  );
};
