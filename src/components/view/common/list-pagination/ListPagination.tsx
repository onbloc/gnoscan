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

// useLayoutEffect warns during SSR; it only matters on the client.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/**
 * Keeps the footer where it was on screen when a chosen page replaces the rows.
 * A shorter page shrinks the document and the browser moves the scroll up with it, so the footer stays under the
 * pointer; coming back to a longer page keeps the scroll, so the footer is pushed away and the view jumps.
 * The footer is measured when the page is chosen, and the scroll is corrected before paint once its rows are in.
 */
const useFooterInPlace = (scope: string, page: number, isSettled: boolean) => {
  const footerRef = React.useRef<HTMLDivElement>(null);
  const chosen = React.useRef<{ scope: string; page: number; footerTop: number } | null>(null);
  const shown = React.useRef(`${scope}|${page}`);

  useIsomorphicLayoutEffect(() => {
    const key = `${scope}|${page}`;
    // Back on the page on screen: the choice never replaced any rows.
    if (shown.current === key) chosen.current = null;
    if (!isSettled || shown.current === key) return;

    shown.current = key;
    const footerTop = footerRef.current?.getBoundingClientRect().top;
    const choice = chosen.current;
    const isChosen = choice?.scope === scope && choice.page === page && footerTop !== undefined;
    const shift = isChosen ? footerTop - choice.footerTop : 0;
    if (shift !== 0) window.scrollTo(window.scrollX, window.scrollY + shift);
    chosen.current = null;
  }, [scope, page, isSettled]);

  const choosePage = (nextPage: number) => {
    const footerTop = footerRef.current?.getBoundingClientRect().top;
    chosen.current = footerTop === undefined ? null : { scope, page: nextPage, footerTop };
  };

  return { footerRef, choosePage };
};

export const ListPagination = ({
  page,
  pageSize,
  totalCount,
  hasNext,
  isSettled,
  scope,
  onChangePage,
}: ListPaginationProps) => {
  const { footerRef, choosePage } = useFooterInPlace(scope, page, isSettled);

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
      wrapperRef={footerRef}
      onChangePage={nextPage => {
        const target = Math.min(Math.max(nextPage, 1), totalPages ?? nextPage);
        choosePage(target);
        onChangePage(target);
      }}
    />
  );
};
