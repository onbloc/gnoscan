import { UseQueryOptions, UseQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetAccountNativeBalanceChangesRequest } from "@/repositories/api/account/request";
import { GetAccountNativeBalanceChangesResponse } from "@/repositories/api/account/response";
import { useApiRepositoryPageQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY, CACHE_POLICY } from "@/common/values/query.constant";

export const useGetAccountNativeBalanceChanges = (
  params: GetAccountNativeBalanceChangesRequest,
  options?: UseQueryOptions<GetAccountNativeBalanceChangesResponse, Error, GetAccountNativeBalanceChangesResponse>,
): UseQueryResult<GetAccountNativeBalanceChangesResponse, Error> => {
  const { apiAccountRepository } = useServiceProvider();

  return useApiRepositoryPageQuery(
    [QUERY_KEY.getAccountNativeBalanceChanges],
    params,
    apiAccountRepository,
    API_REPOSITORY_KEY.ACCOUNT_REPOSITORY,
    (repository, pageParams) => repository.getAccountNativeBalanceChanges(pageParams),
    {
      ...CACHE_POLICY.WARM,
      ...options,
      enabled: !!params.address && options?.enabled !== false,
    },
  );
};
