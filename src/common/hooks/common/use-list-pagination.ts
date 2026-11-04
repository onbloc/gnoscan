import { useCallback, useState } from "react";

import { useHistoryEntryState } from "@/common/hooks/detail-tabs/use-history-entry-state";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

interface ListPageState {
  scope: string;
  page: number;
}

const INITIAL_STATE: ListPageState = { scope: "", page: 1 };

/**
 * Current page of a list, kept per history entry and network.
 * `scope` identifies what is listed (sort, keyword): a different scope starts again from page 1.
 */
export const useListPagination = (name: string, scope = "") => {
  const { currentNetwork } = useNetworkProvider();
  // A network switch keeps the history entry, so the network is part of the name to start each network on page 1.
  const [state, setState] = useHistoryEntryState<ListPageState>(
    `${name}:${currentNetwork?.chainId}:page`,
    INITIAL_STATE,
  );

  const page = state.scope === scope ? state.page : 1;
  const setPage = useCallback((nextPage: number) => setState({ scope, page: nextPage }), [setState, scope]);

  return [page, setPage] as const;
};

/**
 * Page of the rows on screen. `page` moves at once, but the rows of the previous page stay until the next one loads,
 * so anything numbered by page (rank, message number) must use this instead of `page`.
 */
export const useShownPage = (page: number, isPreviousData: boolean) => {
  const [shown, setShown] = useState(page);
  if (!isPreviousData && shown !== page) setShown(page);

  return isPreviousData ? shown : page;
};
