import { UseQueryOptions, UseQueryResult } from "react-query";

import { useListPagination } from "@/common/hooks/common/use-list-pagination";
import { DEFAULT_LIST_ITEMS_SIZE } from "@/common/values/query.constant";
import { ListPaginationProps } from "@/components/view/common/list-pagination/ListPagination";

interface PagedResponse {
  items: unknown[];
  page: { hasNext: boolean; totalCount: number };
}

type PagedQuery<TParams, TResponse> = (
  params: TParams,
  options?: UseQueryOptions<TResponse, Error, TResponse>,
) => UseQueryResult<TResponse, Error>;

const NO_ITEMS: never[] = [];

/**
 * One page-based list: its page (kept per history entry), rows and `ListPagination` props.
 * `scope` is what is listed (path, address, filters): a different scope starts again from page 1.
 * The page size is `params.limit`, or the list default, and is the one used for `pagination` and `startIndex`.
 */
export const usePagedList = <TResponse extends PagedResponse, TParams>(
  name: string,
  scope: string,
  useQuery: PagedQuery<TParams, TResponse>,
  // The list hooks default their params, so TParams may include `undefined`.
  params: Omit<NonNullable<TParams>, "page"> & { limit?: number },
  options?: UseQueryOptions<TResponse, Error, TResponse>,
) => {
  const pageSize = params.limit ?? DEFAULT_LIST_ITEMS_SIZE;
  const [page, setPage] = useListPagination(name, scope);
  const { data, isFetched, isLoading, isPreviousData } = useQuery({ ...params, page } as TParams, options);

  const pagination: ListPaginationProps = {
    page,
    pageSize,
    totalCount: data?.page.totalCount,
    hasNext: data?.page.hasNext,
    // The rows of the previous page are still shown, and the total may not match them.
    isSettled: !isPreviousData,
    scope,
    onChangePage: setPage,
  };

  return {
    data,
    items: (data?.items ?? NO_ITEMS) as TResponse["items"],
    totalCount: data?.page.totalCount,
    isFetched,
    isLoading,
    isPreviousData,
    /** Position of the first row of the page in the whole list, to number the rows. */
    startIndex: (page - 1) * pageSize,
    pagination,
  };
};
