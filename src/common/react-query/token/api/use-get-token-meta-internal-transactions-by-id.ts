import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTokenMetaInternalTransactionsResponse } from "@/repositories/api/token/response";
import { useApiRepositoryInfiniteQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
import { GetTokenMetaInternalTransactionsRequest } from "@/repositories/api/token/request";

export const useGetTokenMetaInternalTransactionsById = (
  params: GetTokenMetaInternalTransactionsRequest,
  options?: UseInfiniteQueryOptions<
    GetTokenMetaInternalTransactionsResponse,
    Error,
    GetTokenMetaInternalTransactionsResponse
  >,
): UseInfiniteQueryResult<GetTokenMetaInternalTransactionsResponse, Error> => {
  const { apiTokenRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<GetTokenMetaInternalTransactionsResponse, Error, typeof apiTokenRepository>(
    [QUERY_KEY.getTokenMetaInternalTransactionsById, params],
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    (repository, pageParam) =>
      repository!.getTokenMetaInternalTransactions({
        ...params,
        cursor: pageParam as string | undefined,
      }),
    {
      ...options,
      getNextPageParam: lastPage => (lastPage.page.hasNext ? lastPage.page.cursor : undefined),
    },
  );
};
