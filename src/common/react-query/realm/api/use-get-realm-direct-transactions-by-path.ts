import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetRealmDirectTransactionsRequest } from "@/repositories/api/realm/request";
import { GetRealmDirectTransactionsResponse } from "@/repositories/api/realm/response";
import { useApiRepositoryInfiniteQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

export const useGetRealmDirectTransactionsByPath = (
  params: GetRealmDirectTransactionsRequest,
  options?: UseInfiniteQueryOptions<GetRealmDirectTransactionsResponse, Error, GetRealmDirectTransactionsResponse>,
): UseInfiniteQueryResult<GetRealmDirectTransactionsResponse, Error> => {
  const { apiRealmRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<GetRealmDirectTransactionsResponse, Error, typeof apiRealmRepository>(
    [QUERY_KEY.getRealmDirectTransactionsByPath, params],
    apiRealmRepository,
    API_REPOSITORY_KEY.REALM_REPOSITORY,
    (repository, pageParam) =>
      repository!.getRealmDirectTransactions({
        ...params,
        cursor: pageParam as string | undefined,
      }),
    {
      ...options,
      getNextPageParam: lastPage => (lastPage.page.hasNext ? lastPage.page.cursor : undefined),
    },
  );
};
