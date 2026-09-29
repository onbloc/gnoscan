import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTokenTransfersResponse } from "@/repositories/api/token/response";
import { useApiRepositoryInfiniteQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
import { GetTokenTransfersRequest } from "@/repositories/api/token/request";

/**
 * Token page's own "Token Transfers" tab: GRC20/GRC721 library Transfer events
 * where the token itself is the from/to entity (exact registered token match).
 */
export const useGetTokenTransfersById = (
  params: GetTokenTransfersRequest,
  options?: UseInfiniteQueryOptions<GetTokenTransfersResponse, Error, GetTokenTransfersResponse>,
): UseInfiniteQueryResult<GetTokenTransfersResponse, Error> => {
  const { apiTokenRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<GetTokenTransfersResponse, Error, typeof apiTokenRepository>(
    [QUERY_KEY.getTokenTransfersById, params],
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    (repository, pageParam) =>
      repository!.getTokenTransfers({
        ...params,
        cursor: pageParam as string | undefined,
      }),
    {
      ...options,
      getNextPageParam: lastPage => (lastPage.page.hasNext ? lastPage.page.cursor : undefined),
    },
  );
};
