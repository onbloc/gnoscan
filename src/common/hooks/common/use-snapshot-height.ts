import { useEffect, useState } from "react";

/**
 * Block height to pin a paged list to, so new blocks do not shift its pages.
 *
 * Page 1 is always requested unpinned (latest). The height its response reports is sent with every
 * later page, and is replaced when page 1 is loaded again. The height is picked when the page changes,
 * so adopting a response's height never refetches the page it came with.
 *
 * Send `height` with the request of `page`, then report the response with {@link useAdoptSnapshotHeight}.
 */
export const useSnapshotHeight = (page: number) => {
  const [latest, setLatest] = useState<number>();
  const [request, setRequest] = useState<{ page: number; height?: number }>({ page });

  const heightOnChange = page > 1 ? latest : undefined;
  if (request.page !== page) setRequest({ page, height: heightOnChange });

  return { height: request.page === page ? request.height : heightOnChange, adopt: setLatest };
};

/**
 * Reports `page.snapshotHeight` of the response shown, to be sent with later pages.
 * `isSettled` is false while the response shown belongs to a previous request.
 */
export const useAdoptSnapshotHeight = (
  adopt: (height: number) => void,
  responseHeight: number | undefined,
  isSettled: boolean,
) => {
  useEffect(() => {
    if (isSettled && responseHeight !== undefined) adopt(responseHeight);
  }, [adopt, isSettled, responseHeight]);
};
