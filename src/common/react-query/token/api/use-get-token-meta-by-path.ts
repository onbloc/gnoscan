import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTokenMetaByPathResponse } from "@/repositories/api/token/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

export const useGetTokenMetaByPath = (
  path: string,
  options?: UseQueryOptions<GetTokenMetaByPathResponse, Error, GetTokenMetaByPathResponse>,
) => {
  const { apiTokenRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getTokenMetaByPath, path],
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    repository => repository.getTokenMetaByPath(path),
    // Token meta is static; a failed lookup (e.g. 404) has no data and would otherwise refetch on every focus.
    {
      ...options,
      enabled: !!path,
      cacheTime: 60 * 60 * 1000,
      staleTime: 60 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );
};
