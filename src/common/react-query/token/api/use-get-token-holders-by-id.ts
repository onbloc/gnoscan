import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTokenHoldersResponse } from "@/repositories/api/token/response";
import { useApiRepositoryInfiniteQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
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
  options?: UseInfiniteQueryOptions<GetTokenHoldersResponse, Error, GetTokenHoldersResponse>,
): UseInfiniteQueryResult<GetTokenHoldersResponse, Error> => {
  const { apiTokenRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<GetTokenHoldersResponse, Error, typeof apiTokenRepository>(
    [QUERY_KEY.getTokenHoldersById, params],
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    (repository, pageParam) =>
      repository!.getTokenHolders({
        ...params,
        cursor: pageParam as string | undefined,
      }),
    {
      ...options,
      getNextPageParam: lastPage => (lastPage.page.hasNext ? lastPage.page.cursor : undefined),
    },
  );
};
