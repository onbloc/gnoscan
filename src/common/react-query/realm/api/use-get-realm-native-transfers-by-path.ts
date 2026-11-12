import { UseQueryOptions, UseQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetRealmNativeTransfersRequest } from "@/repositories/api/realm/request";
import { GetRealmNativeTransfersResponse } from "@/repositories/api/realm/response";
import { useApiRepositoryPageQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

export const useGetRealmNativeTransfersByPath = (
  params: GetRealmNativeTransfersRequest,
  options?: UseQueryOptions<GetRealmNativeTransfersResponse, Error, GetRealmNativeTransfersResponse>,
): UseQueryResult<GetRealmNativeTransfersResponse, Error> => {
  const { apiRealmRepository } = useServiceProvider();

  return useApiRepositoryPageQuery(
    [QUERY_KEY.getRealmNativeTransfersByPath],
    params,
    apiRealmRepository,
    API_REPOSITORY_KEY.REALM_REPOSITORY,
    (repository, pageParams) => repository.getRealmNativeTransfers(pageParams),
    {
      ...options,
      enabled: !!params.path && options?.enabled !== false,
    },
  );
};
