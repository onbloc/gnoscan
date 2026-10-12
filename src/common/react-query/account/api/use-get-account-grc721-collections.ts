import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetAccountGRC721CollectionsResponse } from "@/repositories/api/account/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

export const useGetAccountGRC721Collections = (
  address: string,
  options?: UseQueryOptions<GetAccountGRC721CollectionsResponse, Error, GetAccountGRC721CollectionsResponse>,
) => {
  const { apiAccountRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getAccountGRC721Collections, address],
    apiAccountRepository,
    API_REPOSITORY_KEY.ACCOUNT_REPOSITORY,
    repository => repository.getAccountGRC721Collections(address),
    {
      ...options,
      enabled: !!address && options?.enabled !== false,
    },
  );
};
