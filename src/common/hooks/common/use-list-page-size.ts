import { useHistoryEntryState } from "@/common/hooks/detail-tabs/use-history-entry-state";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { DEFAULT_LIST_PAGE_SIZE, ListPageSize } from "@/common/values/list-page-size.constant";

/** Rows per page of a list, kept per history entry and network like its page. */
export const useListPageSize = (name: string) => {
  const { currentNetwork } = useNetworkProvider();

  return useHistoryEntryState<ListPageSize>(`${name}:${currentNetwork?.chainId}:page-size`, DEFAULT_LIST_PAGE_SIZE);
};
