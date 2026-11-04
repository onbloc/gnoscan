import { UseQueryOptions, UseQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTokenHoldersResponse } from "@/repositories/api/token/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY, DEFAULT_LIST_ITEMS_SIZE } from "@/common/values/query.constant";
import { GetTokenHoldersRequest } from "@/repositories/api/token/request";

/**
 * Basic hooks to get token holders data from the API
 *
 * This hook fetches the holder list (address, balance, percentage) for a specific token
 * directly from the API and returns the data in its original format.
 *
 * @param params - The token path (and pagination options) to fetch its holders
 * @param options - @tanstack/react-query options
 * @returns Original token holders data fetched from the API and the status of the query
 */
export const useGetTokenHoldersByid = (
  params: GetTokenHoldersRequest,
  options?: UseQueryOptions<GetTokenHoldersResponse, Error, GetTokenHoldersResponse>,
): UseQueryResult<GetTokenHoldersResponse, Error> => {
  const { apiTokenRepository } = useServiceProvider();

  return useApiRepositoryQuery<GetTokenHoldersResponse, Error, typeof apiTokenRepository>(
    [QUERY_KEY.getTokenHoldersById, params],
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    repository =>
      repository!.getTokenHolders({
        ...params,
        limit: params.limit ?? DEFAULT_LIST_ITEMS_SIZE,
      }),
    { keepPreviousData: true, ...options },
  );
};
