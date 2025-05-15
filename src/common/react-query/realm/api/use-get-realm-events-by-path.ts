import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetRealmEventsResponse } from "@/repositories/api/realm/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

/**
 * Basic hooks to get realm events data from the API
 *
 * This hook fetches realm events data directly from the API and returns the data in its original format.
 * Uses the realm path to retrieve events associated with a specific realm.
 *
 * Notes: The source data returned by this hook is found in `use-api-realm-events.ts`.
 * mapped to the format used by your application.
 *
 * @param path - The path identifier to fetch events for a specific realm
 * @param options - @tanstack/react-query options
 * @returns Original realm events data fetched from the API and the status of the query
 */
export const useGetRealmEventsByPath = (
  path: string,
  options?: UseQueryOptions<GetRealmEventsResponse, Error, GetRealmEventsResponse>,
) => {
  const { apiRealmRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getRealmEventsByPath, path],
    apiRealmRepository,
    API_REPOSITORY_KEY.REALM_REPOSITORY,
    repository => repository.getRealmEvents(path),
    options,
  );
};
