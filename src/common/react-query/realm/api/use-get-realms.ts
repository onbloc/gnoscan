import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetRealmsRequestParameters } from "@/repositories/api/realm/request";
import { GetRealmsResponse } from "@/repositories/api/realm/response";
import { useApiRepositoryInfiniteQuery } from "@/common/react-query/hoc/api";
import {
  API_REPOSITORY_KEY,
  DEFAULT_LIST_ITEMS_SIZE,
  DEFAULT_LIST_ITEMS_CACHE_TIME,
  DEFAULT_LIST_ITEMS_STALE_TIME,
} from "@/common/values/query.constant";

/**
 * Basic hooks to get realms data from the API
 *
 * This hook fetches realms data directly from the API and returns the data in its original format.
 * Supports infinite scrolling with cursor-based pagination for efficient data loading.
 *
 * Notes: The source data returned by this hook is found in `use-api-realms.ts`.
 * mapped to the format used by your application.
 *
 * @param params - API request parameters
 * @param options - @tanstack/react-query
 * @returns Original realms data with pagination information and the status of the query
 */
export const useGetRealms = (
  params: GetRealmsRequestParameters = {},
  options?: UseInfiniteQueryOptions<GetRealmsResponse, Error, GetRealmsResponse>,
): UseInfiniteQueryResult<GetRealmsResponse, Error> => {
  const { apiRealmRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<GetRealmsResponse, Error, typeof apiRealmRepository>(
    [QUERY_KEY.getRealms, params],
    apiRealmRepository,
    API_REPOSITORY_KEY.REALM_REPOSITORY,
    (repository, pageParam) =>
      repository!.getRealms({
        ...params,
        limit: DEFAULT_LIST_ITEMS_SIZE,
        cursor: pageParam as string | undefined,
      }),
    {
      getNextPageParam: lastPage => (lastPage.page.hasNext ? lastPage.page.cursor : undefined),
      cacheTime: DEFAULT_LIST_ITEMS_CACHE_TIME,
      staleTime: DEFAULT_LIST_ITEMS_STALE_TIME,
      ...options,
    },
  );
};
