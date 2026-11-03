import { useCallback } from "react";

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
