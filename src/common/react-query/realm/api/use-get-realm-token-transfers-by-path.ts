import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetRealmTokenTransfersRequest } from "@/repositories/api/realm/request";
import { GetRealmTokenTransfersResponse } from "@/repositories/api/realm/response";
import { useApiRepositoryInfiniteQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

export const useGetRealmTokenTransfersByPath = (
  params: GetRealmTokenTransfersRequest,
  options?: UseInfiniteQueryOptions<GetRealmTokenTransfersResponse, Error, GetRealmTokenTransfersResponse>,
): UseInfiniteQueryResult<GetRealmTokenTransfersResponse, Error> => {
  const { apiRealmRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<GetRealmTokenTransfersResponse, Error, typeof apiRealmRepository>(
    [QUERY_KEY.getRealmTokenTransfersByPath, params],
    apiRealmRepository,
    API_REPOSITORY_KEY.REALM_REPOSITORY,
    (repository, cursor) =>
      repository!.getRealmTokenTransfers({
        ...params,
        cursor,
      }),
    {
      ...options,
      enabled: !!params.path && options?.enabled !== false,
    },
  );
};
