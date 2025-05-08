import { useQuery, UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetRealmTransactionsResponse } from "@/repositories/api/realm/response";
import { CommonError } from "@/common/errors";

/**
 * Basic hooks to get realm transactions data from the API
 *
 * This hook fetches realm transactions data directly from the API and returns the data in its original format.
 * Uses the realm path to retrieve transactions associated with a specific realm.
 *
 * Notes: The source data returned by this hook is found in `use-api-realm-transactions.ts`.
 * mapped to the format used by your application.
 *
 * @param path - The path identifier to fetch transactions for a specific realm
 * @param options - @tanstack/react-query options
 * @returns Original realm transactions data fetched from the API and the status of the query
 */
export const useGetRealmTransactionsByPath = (
  path: string,
  options?: UseQueryOptions<GetRealmTransactionsResponse, Error, GetRealmTransactionsResponse>,
) => {
  const { apiRealmRepository } = useServiceProvider();

  return useQuery({
    queryKey: [QUERY_KEY.getRealmTransactionsByPath, path],
    queryFn: () => {
      if (!apiRealmRepository) {
        throw new CommonError("FAILED_INITIALIZE_REPOSITORY", "ApiRealmRepository");
      }

      return apiRealmRepository.getRealmTransactions(path);
    },
    ...options,
  });
};
