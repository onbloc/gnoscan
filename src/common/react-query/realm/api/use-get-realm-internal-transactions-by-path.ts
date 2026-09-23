import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetRealmInternalTransactionsRequest } from "@/repositories/api/realm/request";
import { GetRealmInternalTransactionsResponse } from "@/repositories/api/realm/response";
import { useApiRepositoryInfiniteQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

export const useGetRealmInternalTransactionsByPath = (
  params: GetRealmInternalTransactionsRequest,
  options?: UseInfiniteQueryOptions<GetRealmInternalTransactionsResponse, Error, GetRealmInternalTransactionsResponse>,
): UseInfiniteQueryResult<GetRealmInternalTransactionsResponse, Error> => {
  const { apiRealmRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<GetRealmInternalTransactionsResponse, Error, typeof apiRealmRepository>(
    [QUERY_KEY.getRealmInternalTransactionsByPath, params],
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
