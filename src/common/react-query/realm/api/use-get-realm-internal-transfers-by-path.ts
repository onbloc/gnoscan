import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetRealmTransactionsRequest } from "@/repositories/api/realm/request";
import { GetRealmTransactionsResponse } from "@/repositories/api/realm/response";
import { useApiRepositoryInfiniteQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

export const useGetRealmInternalTransfersByPath = (
  params: GetRealmTransactionsRequest,
  options?: UseInfiniteQueryOptions<GetRealmTransactionsResponse, Error, GetRealmTransactionsResponse>,
): UseInfiniteQueryResult<GetRealmTransactionsResponse, Error> => {
  const { apiRealmRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<GetRealmTransactionsResponse, Error, typeof apiRealmRepository>(
    [QUERY_KEY.getRealmInternalTransfersByPath, params],
    apiRealmRepository,
    API_REPOSITORY_KEY.REALM_REPOSITORY,
    (repository, pageParam) =>
      repository!.getRealmInternalTransactions({
        ...params,
        cursor: pageParam as string | undefined,
      }),
    {
      ...options,
      getNextPageParam: lastPage => (lastPage.page.hasNext ? lastPage.page.cursor : undefined),
    },
  );
};
