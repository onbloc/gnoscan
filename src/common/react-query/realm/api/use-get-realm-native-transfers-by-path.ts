import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetRealmNativeTransfersRequest } from "@/repositories/api/realm/request";
import { GetRealmNativeTransfersResponse } from "@/repositories/api/realm/response";
import { useApiRepositoryInfiniteQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

export const useGetRealmNativeTransfersByPath = (
  params: GetRealmNativeTransfersRequest,
  options?: UseInfiniteQueryOptions<GetRealmNativeTransfersResponse, Error, GetRealmNativeTransfersResponse>,
): UseInfiniteQueryResult<GetRealmNativeTransfersResponse, Error> => {
  const { apiRealmRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<GetRealmNativeTransfersResponse, Error, typeof apiRealmRepository>(
    [QUERY_KEY.getRealmNativeTransfersByPath, params],
    apiRealmRepository,
    API_REPOSITORY_KEY.REALM_REPOSITORY,
    (repository, pageParam) =>
      repository!.getRealmNativeTransfers({
        ...params,
        cursor: pageParam as string | undefined,
      }),
    {
      ...options,
      getNextPageParam: lastPage => (lastPage.page.hasNext ? lastPage.page.cursor : undefined),
    },
  );
};
