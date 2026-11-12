import { UseQueryOptions, UseQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetRealmsRequestParameters } from "@/repositories/api/realm/request";
import { GetRealmsResponse } from "@/repositories/api/realm/response";
import { useApiRepositoryPageQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

/**
 * Basic hooks to get realms data from the API
 *
 * This hook fetches realms data directly from the API and returns the data in its original format.
 * Fetches one page; the previous page stays on screen while the next one loads.
 *
 * Notes: The source data returned by this hook is found in `use-api-realms.ts`.
 * mapped to the format used by your application.
 *
 * @param params - API request parameters
 * @param options - @tanstack/react-query
 * @returns Original realms data with pagination information and the status of the query
 */
export const useGetRealms = (
  // The page size is fixed: the list components number rows and pages by `DEFAULT_LIST_ITEMS_SIZE`.
  params: Omit<GetRealmsRequestParameters, "limit"> & { limit?: never } = {},
  options?: UseQueryOptions<GetRealmsResponse, Error, GetRealmsResponse>,
): UseQueryResult<GetRealmsResponse, Error> => {
  const { apiRealmRepository } = useServiceProvider();

  return useApiRepositoryPageQuery(
    [QUERY_KEY.getRealms],
    params,
    apiRealmRepository,
    API_REPOSITORY_KEY.REALM_REPOSITORY,
    (repository, pageParams) => repository.getRealms(pageParams),
    options,
  );
};
