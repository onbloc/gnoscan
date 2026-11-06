import { useEffect, useRef } from "react";
import { UseQueryOptions } from "react-query";

import { PagedQuery, PagedResponse, usePagedList } from "@/common/hooks/common/use-paged-list";
import { useHistoryEntryState } from "@/common/hooks/detail-tabs/use-history-entry-state";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { FunctionFilterApiParams, FunctionFilterValue } from "@/common/types/function-filter";
import { getFunctionFilterScope, toFunctionFilterApiParams } from "@/common/utils/function-filter.utility";
import { ALL_FUNCTIONS } from "@/common/values/function-filter.constant";

/** Function filter of a list, kept per history entry and network (the labels differ per network). */
export const useFunctionFilterState = (name: string) => {
  const { currentNetwork } = useNetworkProvider();

  return useHistoryEntryState<FunctionFilterValue>(`${name}:${currentNetwork?.chainId}:function-filter`, ALL_FUNCTIONS);
};

/**
 * Commits page 1 once the filter scope changes. `useListPagination` shows page 1 for a new scope but keeps the
 * page of the old one stored, so applying the earlier filter again would bring that page back. The first render
 * keeps the page restored by history navigation.
 */
export const useFirstPageOnFilterChange = (filterScope: string, setPage: (page: number) => void) => {
  const shownScope = useRef(filterScope);

  useEffect(() => {
    if (shownScope.current === filterScope) return;

    shownScope.current = filterScope;
    setPage(1);
  }, [filterScope, setPage]);
};

/**
 * `usePagedList` of a list that takes the function filter (`function` / `excludeFunction`).
 * A different filter lists other rows, so it starts again from page 1; `scope` is what the list belongs to.
 */
export const useFunctionFilteredPagedList = <TResponse extends PagedResponse, TParams extends FunctionFilterApiParams>(
  name: string,
  scope: string,
  filter: FunctionFilterValue,
  useQuery: PagedQuery<TParams, TResponse>,
  params: Omit<NonNullable<TParams>, "page" | keyof FunctionFilterApiParams> & { limit?: number },
  options?: UseQueryOptions<TResponse, Error, TResponse>,
) => {
  const filterScope = getFunctionFilterScope(filter);
  const list = usePagedList(
    name,
    `${scope}|${filterScope}`,
    useQuery,
    { ...params, ...toFunctionFilterApiParams(filter) } as Omit<NonNullable<TParams>, "page"> & { limit?: number },
    options,
  );
  useFirstPageOnFilterChange(filterScope, list.pagination.onChangePage);

  return list;
};
