import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetRealmResponse } from "@/repositories/api/realm/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

/**
 * Basic hooks to get realm data from the API
 *
 * This hook fetches a single realm data directly from the API and returns the data in its original format.
 * Uses the realm path to identify and retrieve the specific realm.
 *
 * Notes: The source data returned by this hook is found in `use-api-realm.ts`.
 * mapped to the format used by your application.
 *
 * @param path - The path identifier for the specific realm
 * @param options - @tanstack/react-query options
 * @returns Original realm data fetched from the API and the status of the query
 */
export const useGetRealmByPath = (
  path: string,
  options?: UseQueryOptions<GetRealmResponse, Error, GetRealmResponse>,
) => {
  const { apiRealmRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getRealmByPath, path],
    apiRealmRepository,
    API_REPOSITORY_KEY.REALM_REPOSITORY,
    repository => repository.getRealm(path),
    options,
  );
};
