import { UseQueryOptions, UseQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetAccountNativeBalanceHistoryRequest } from "@/repositories/api/account/request";
import { GetAccountNativeBalanceHistoryResponse } from "@/repositories/api/account/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY, CACHE_POLICY } from "@/common/values/query.constant";

export const useGetAccountNativeBalanceHistory = (
  params: GetAccountNativeBalanceHistoryRequest,
  options?: UseQueryOptions<GetAccountNativeBalanceHistoryResponse, Error, GetAccountNativeBalanceHistoryResponse>,
): UseQueryResult<GetAccountNativeBalanceHistoryResponse, Error> => {
  const { apiAccountRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getAccountNativeBalanceHistory, params],
    apiAccountRepository,
    API_REPOSITORY_KEY.ACCOUNT_REPOSITORY,
    repository => repository.getAccountNativeBalanceHistory(params),
    {
      ...CACHE_POLICY.WARM,
      ...options,
      enabled: !!params.address && options?.enabled !== false,
    },
  );
};
