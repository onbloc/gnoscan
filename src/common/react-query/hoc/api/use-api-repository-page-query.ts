import { UseQueryOptions, UseQueryResult } from "react-query";

import { useApiRepositoryQuery } from "@/common/react-query/hoc/api/use-api-repository-query";
import { API_REPOSITORY_KEY, DEFAULT_LIST_ITEMS_SIZE } from "@/common/values/query.constant";

/**
 * Higher-order function for queries that fetch one page of a page-based API list
 *
 * Adds to `useApiRepositoryQuery`: the previous page stays on screen while the next one loads,
 * and `limit` defaults to the list page size, so a caller that numbers rows by page uses the same size.
 *
 * @param queryKey - query key array; `params` is appended to it
 * @param params - request parameters (`page`, `limit` and the filters of the list)
 * @param repository - API repository instance
 * @param repositoryName - repository identifier
 * @param queryFn - function to fetch the page, called with `params` and its resolved `limit`
 * @param options - react-query options
 */
export function useApiRepositoryPageQuery<TData, TParams extends { limit?: number }, TRepository = unknown>(
  queryKey: unknown[],
  params: TParams,
  repository: TRepository | null,
  repositoryName: API_REPOSITORY_KEY,
  queryFn: (repository: TRepository, params: TParams & { limit: number }) => Promise<TData>,
  options?: UseQueryOptions<TData, Error, TData>,
): UseQueryResult<TData, Error> {
  return useApiRepositoryQuery<TData, Error, TRepository>(
    [...queryKey, params],
    repository,
    repositoryName,
    repo => queryFn(repo, { ...params, limit: params.limit ?? DEFAULT_LIST_ITEMS_SIZE }),
    { keepPreviousData: true, ...options },
  );
}
