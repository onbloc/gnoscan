import { UseQueryOptions, UseQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetRealmDirectTransactionsRequest } from "@/repositories/api/realm/request";
import { GetRealmDirectTransactionsResponse } from "@/repositories/api/realm/response";
import { useApiRepositoryPageQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

export const useGetRealmDirectTransactionsByPath = (
  params: GetRealmDirectTransactionsRequest,
  options?: UseQueryOptions<GetRealmDirectTransactionsResponse, Error, GetRealmDirectTransactionsResponse>,
): UseQueryResult<GetRealmDirectTransactionsResponse, Error> => {
  const { apiRealmRepository } = useServiceProvider();

  return useApiRepositoryPageQuery(
    [QUERY_KEY.getRealmDirectTransactionsByPath],
    params,
    apiRealmRepository,
    API_REPOSITORY_KEY.REALM_REPOSITORY,
    (repository, pageParams) => repository.getRealmDirectTransactions(pageParams),
    {
      ...options,
      enabled: !!params.path && options?.enabled !== false,
    },
  );
};
