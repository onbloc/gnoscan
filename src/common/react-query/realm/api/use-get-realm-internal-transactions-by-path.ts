import { UseQueryOptions, UseQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetRealmInternalTransactionsRequest } from "@/repositories/api/realm/request";
import { GetRealmInternalTransactionsResponse } from "@/repositories/api/realm/response";
import { useApiRepositoryPageQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

export const useGetRealmInternalTransactionsByPath = (
  params: GetRealmInternalTransactionsRequest,
  options?: UseQueryOptions<GetRealmInternalTransactionsResponse, Error, GetRealmInternalTransactionsResponse>,
): UseQueryResult<GetRealmInternalTransactionsResponse, Error> => {
  const { apiRealmRepository } = useServiceProvider();

  return useApiRepositoryPageQuery(
    [QUERY_KEY.getRealmInternalTransactionsByPath],
    params,
    apiRealmRepository,
    API_REPOSITORY_KEY.REALM_REPOSITORY,
    (repository, pageParams) => repository.getRealmInternalTransactions(pageParams),
    {
      ...options,
      enabled: !!params.path && options?.enabled !== false,
    },
  );
};
