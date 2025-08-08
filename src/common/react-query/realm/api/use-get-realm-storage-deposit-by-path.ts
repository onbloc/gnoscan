import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetRealmStorageDepositResponse } from "@/repositories/api/realm/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

export const useGetRealmStorageDepositByPath = (
  path: string,
  options?: UseQueryOptions<GetRealmStorageDepositResponse | null, Error, GetRealmStorageDepositResponse | null>,
) => {
  const { apiRealmRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getRealmStorageDepositByPath, path],
    apiRealmRepository,
    API_REPOSITORY_KEY.REALM_REPOSITORY,
    repository => repository.getRealmStorageDeposit(path),
    options,
  );
};
