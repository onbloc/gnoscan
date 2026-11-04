import { UseQueryOptions, UseQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTokensRequestParameters } from "@/repositories/api/token/request";
import { GetTokensResponse } from "@/repositories/api/token/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY, DEFAULT_LIST_ITEMS_SIZE } from "@/common/values/query.constant";

/**
 * Basic hooks to get tokens list data from the API
 *
 * This hook fetches one page of tokens directly from the API and returns the data in its original format.
 * The previous page stays on screen while the next one loads.
 *
 * Notes: The source data returned by this hook is found in `use-api-tokens.ts`.
 * mapped to the format used by your application.
 *
 * @param params - API request parameters for paging, filtering and sorting tokens (optional, defaults to {})
 * @param options - @tanstack/react-query options
 * @returns Original tokens page with pagination information and the status of the query
 */
export const useGetTokens = (
  params: GetTokensRequestParameters = {},
  options?: UseQueryOptions<GetTokensResponse, Error, GetTokensResponse>,
): UseQueryResult<GetTokensResponse, Error> => {
  const { apiTokenRepository } = useServiceProvider();

  return useApiRepositoryQuery<GetTokensResponse, Error, typeof apiTokenRepository>(
    [QUERY_KEY.getTokens, params],
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    repository =>
      repository!.getTokens({
        limit: DEFAULT_LIST_ITEMS_SIZE,
        ...params,
      }),
    { keepPreviousData: true, ...options },
  );
};
