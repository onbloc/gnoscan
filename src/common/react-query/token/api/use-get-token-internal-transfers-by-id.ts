import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTokenTransactionsRequest } from "@/repositories/api/token/request";
import { GetTokenTransactionsResponse } from "@/repositories/api/token/response";
import { useApiRepositoryInfiniteQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

export const useGetTokenInternalTransfersByid = (
  params: GetTokenTransactionsRequest,
  options?: UseInfiniteQueryOptions<GetTokenTransactionsResponse, Error, GetTokenTransactionsResponse>,
): UseInfiniteQueryResult<GetTokenTransactionsResponse, Error> => {
  const { apiTokenRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<GetTokenTransactionsResponse, Error, typeof apiTokenRepository>(
    [QUERY_KEY.getTokenInternalTransfersById, params],
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    (repository, pageParam) =>
      repository!.getTokenInternalTransactions({
        ...params,
        cursor: pageParam as string | undefined,
      }),
    {
      ...options,
      getNextPageParam: lastPage => (lastPage.page.hasNext ? lastPage.page.cursor : undefined),
    },
  );
};
