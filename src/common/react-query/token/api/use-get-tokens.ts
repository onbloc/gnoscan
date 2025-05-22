import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTokensRequestParameters } from "@/repositories/api/token/request";
import { GetTokensResponse } from "@/repositories/api/token/response";
import { useApiRepositoryInfiniteQuery } from "@/common/react-query/hoc/api";
import {
  API_REPOSITORY_KEY,
  DEFAULT_LIST_ITEMS_SIZE,
  DEFAULT_LIST_ITEMS_CACHE_TIME,
  DEFAULT_LIST_ITEMS_STALE_TIME,
} from "@/common/values/query.constant";

/**
 * Basic hooks to get tokens list data from the API with infinite scrolling
 *
 * This hook fetches tokens data with cursor-based pagination directly from the API.
 * Supports infinite scrolling for efficient data loading of large token lists.
 *
 * Notes: The source data returned by this hook is found in `use-api-tokens.ts`.
 * mapped to the format used by your application.
 *
 * @param params - API request parameters for filtering and sorting tokens (optional, defaults to {})
 * @param options - @tanstack/react-query infinite query options
 * @returns Original tokens list data with pagination information and the status of the query
 */
export const useGetTokens = (
  params: GetTokensRequestParameters = {},
  options?: UseInfiniteQueryOptions<GetTokensResponse, Error, GetTokensResponse>,
): UseInfiniteQueryResult<GetTokensResponse, Error> => {
  const { apiTokenRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<GetTokensResponse, Error, typeof apiTokenRepository>(
    [QUERY_KEY.getTokens, params],
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    (repository, pageParam) =>
      repository!.getTokens({
        ...params,
        limit: DEFAULT_LIST_ITEMS_SIZE,
        cursor: pageParam as string | undefined,
      }),
    {
      getNextPageParam: lastPage => (lastPage.page.hasNext ? lastPage.page.cursor : undefined),
      cacheTime: DEFAULT_LIST_ITEMS_CACHE_TIME,
      staleTime: DEFAULT_LIST_ITEMS_STALE_TIME,
      ...options,
    },
  );
};
