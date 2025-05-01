import { useInfiniteQuery, UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetRealmsRequestParameters } from "@/repositories/api/realm/request";
import { GetRealmsResponse } from "@/repositories/api/realm/response";
import { CommonError } from "@/common/errors";

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

  return useInfiniteQuery({
    queryKey: [QUERY_KEY.getRealms, params],
    queryFn: ({ pageParam }) => {
      if (!apiRealmRepository) {
        throw new CommonError("FAILED_INITIALIZE_REPOSITORY", "ApiRealmRepository");
      }

      return apiRealmRepository
        .getRealms({
          ...params,
          cursor: pageParam,
        })
        .then(response => {
          return {
            ...response,
          };
        });
    },
    getNextPageParam: lastPage => (lastPage.page.hasNext ? lastPage.page.cursor : undefined),
    ...options,
  });
};
