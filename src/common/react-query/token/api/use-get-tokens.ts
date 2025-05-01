import { useInfiniteQuery, UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTokensRequestParameters } from "@/repositories/api/token/request";
import { GetTokensResponse } from "@/repositories/api/token/response";
import { CommonError } from "@/common/errors";

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

  return useInfiniteQuery({
    queryKey: [QUERY_KEY.getTokens, params],
    queryFn: ({ pageParam }) => {
      if (!apiTokenRepository) {
        throw new CommonError("FAILED_INITIALIZE_REPOSITORY", "ApiTokenRepository");
      }

      return apiTokenRepository
        .getTokens({
          ...params,
          cursor: pageParam,
        })
        .then(response => {
          return {
            ...response,
          };
        });
    },
    getNextPageParam: lastPage => (lastPage.page.hasNext ? lastPage.page.cursor : undefined),
    ...options,
  });
};
