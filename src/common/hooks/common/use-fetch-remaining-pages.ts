import React from "react";

interface PagedQuery {
  data: unknown;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  isError: boolean;
  fetchNextPage: () => unknown;
}

/**
 * Keeps requesting the next page while `enabled`, until no page is left.
 *
 * Depends on `data` so it re-runs after every loaded page, even when React batches away
 * the in-flight render. Stops on error so a failed page is not retried in a loop.
 */
export const useFetchRemainingPages = (
  { data, hasNextPage, isFetchingNextPage, isError, fetchNextPage }: PagedQuery,
  enabled: boolean,
) => {
  React.useEffect(() => {
    if (enabled && hasNextPage && !isFetchingNextPage && !isError) fetchNextPage();
  }, [enabled, data, hasNextPage, isFetchingNextPage, isError, fetchNextPage]);
};
