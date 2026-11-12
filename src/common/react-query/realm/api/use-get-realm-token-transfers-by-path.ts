import { UseQueryOptions, UseQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetRealmTokenTransfersRequest } from "@/repositories/api/realm/request";
import { GetRealmTokenTransfersResponse } from "@/repositories/api/realm/response";
import { useApiRepositoryPageQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

export const useGetRealmTokenTransfersByPath = (
  params: GetRealmTokenTransfersRequest,
  options?: UseQueryOptions<GetRealmTokenTransfersResponse, Error, GetRealmTokenTransfersResponse>,
): UseQueryResult<GetRealmTokenTransfersResponse, Error> => {
  const { apiRealmRepository } = useServiceProvider();

  return useApiRepositoryPageQuery(
    [QUERY_KEY.getRealmTokenTransfersByPath],
    params,
    apiRealmRepository,
    API_REPOSITORY_KEY.REALM_REPOSITORY,
    (repository, pageParams) => repository.getRealmTokenTransfers(pageParams),
    {
      ...options,
      enabled: !!params.path && options?.enabled !== false,
    },
  );
};
