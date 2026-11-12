import { UseQueryOptions, UseQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetRealmHoldersRequest } from "@/repositories/api/realm/request";
import { GetRealmHoldersResponse } from "@/repositories/api/realm/response";
import { useApiRepositoryPageQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

// GRC721 collection holders; also serves the NFT collection holders tab (path is the
// collection's tokenId or realm path).
export const useGetRealmHoldersByPath = (
  params: GetRealmHoldersRequest,
  options?: UseQueryOptions<GetRealmHoldersResponse, Error, GetRealmHoldersResponse>,
): UseQueryResult<GetRealmHoldersResponse, Error> => {
  const { apiRealmRepository } = useServiceProvider();

  return useApiRepositoryPageQuery(
    [QUERY_KEY.getRealmHoldersByPath],
    params,
    apiRealmRepository,
    API_REPOSITORY_KEY.REALM_REPOSITORY,
    (repository, pageParams) => repository.getRealmHolders(pageParams),
    { ...options, enabled: !!params.path && options?.enabled !== false },
  );
};
