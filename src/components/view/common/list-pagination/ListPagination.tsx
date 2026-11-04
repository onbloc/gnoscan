import React from "react";

import { Pagination } from "@/components/ui/pagination";

export interface ListPaginationProps {
  page: number;
  pageSize: number;
  // Undefined while the response is missing (loading or failed)
  totalCount?: number;
  hasNext?: boolean;
  // False while rows of a previous query are shown, when totalCount may not match the page.
  isSettled: boolean;
  // What is listed (sort, keyword), same as the one of `useListPagination`. Empty for a list with no sort or filter.
  scope: string;
  onChangePage: (page: number) => void;
}

export const ListPagination = ({
  page,
  pageSize,
  totalCount,
  hasNext,
  isSettled,
  scope,
  onChangePage,
}: ListPaginationProps) => {
  // The total of the last response stays while a later request fails, so the page count remains usable.
  // It is dropped when the scope changes, as another sort or keyword has another total.
  const [known, setKnown] = React.useState({ scope, total: isSettled ? totalCount : undefined });
  if (isSettled && totalCount !== undefined && (known.scope !== scope || known.total !== totalCount)) {
    setKnown({ scope, total: totalCount });
  }

  const shownTotalCount = totalCount ?? (known.scope === scope ? known.total : undefined);
  const totalPages = shownTotalCount === undefined ? undefined : Math.max(1, Math.ceil(shownTotalCount / pageSize));

  // A saved page can exceed the current page count (e.g. rows removed, history restore).
  const isPastLastPage = isSettled && totalCount !== undefined && totalPages !== undefined && page > totalPages;
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
      onChangePage={nextPage => onChangePage(Math.min(Math.max(nextPage, 1), totalPages ?? nextPage))}
    />
  );
};
