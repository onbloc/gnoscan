import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetRealmHoldersRequest } from "@/repositories/api/realm/request";
import { GetRealmHoldersResponse } from "@/repositories/api/realm/response";
import { useApiRepositoryInfiniteQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

// GRC721 collection holders; also serves the NFT collection holders tab (path is the
// collection's tokenId or realm path).
export const useGetRealmHoldersByPath = (
  params: GetRealmHoldersRequest,
  options?: UseInfiniteQueryOptions<GetRealmHoldersResponse, Error, GetRealmHoldersResponse>,
): UseInfiniteQueryResult<GetRealmHoldersResponse, Error> => {
  const { apiRealmRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<GetRealmHoldersResponse, Error, typeof apiRealmRepository>(
    [QUERY_KEY.getRealmHoldersByPath, params],
    apiRealmRepository,
    API_REPOSITORY_KEY.REALM_REPOSITORY,
    (repository, cursor) =>
      repository!.getRealmHolders({
        ...params,
        cursor,
      }),
    {
      ...options,
      enabled: !!params.path && options?.enabled !== false,
    },
  );
};
