import { useQuery, UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetRealmResponse } from "@/repositories/api/realm/response";
import { CommonError } from "@/common/errors";

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
export const useGetRealmByPath = (path: string, options?: UseQueryOptions<GetRealmResponse, Error>) => {
  const { apiRealmRepository } = useServiceProvider();

  return useQuery({
    queryKey: [QUERY_KEY.getRealmByPath, path],
    queryFn: () => {
      if (!apiRealmRepository) {
        throw new CommonError("FAILED_INITIALIZE_REPOSITORY", "ApiRealmRepository");
      }

      return apiRealmRepository.getRealm(path);
    },
    ...options,
  });
};
