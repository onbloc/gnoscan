import { UseQueryOptions, UseQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetAccountNativeTransfersRequest } from "@/repositories/api/account/request";
import { GetAccountNativeTransfersResponse } from "@/repositories/api/account/response";
import { useApiRepositoryPageQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY, CACHE_POLICY } from "@/common/values/query.constant";

export const useGetAccountNativeTransfers = (
  params: GetAccountNativeTransfersRequest,
  options?: UseQueryOptions<GetAccountNativeTransfersResponse, Error, GetAccountNativeTransfersResponse>,
): UseQueryResult<GetAccountNativeTransfersResponse, Error> => {
  const { apiAccountRepository } = useServiceProvider();

  return useApiRepositoryPageQuery(
    [QUERY_KEY.getAccountNativeTransfers],
    params,
    apiAccountRepository,
    API_REPOSITORY_KEY.ACCOUNT_REPOSITORY,
    (repository, pageParams) => repository.getAccountNativeTransfers(pageParams),
    {
      ...CACHE_POLICY.LIVE,
      ...options,
      enabled: !!params.address && options?.enabled !== false,
    },
  );
};
