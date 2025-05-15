import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetRealmTransactionsResponse } from "@/repositories/api/realm/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

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

  return useApiRepositoryQuery(
    [QUERY_KEY.getRealmTransactionsByPath, path],
    apiRealmRepository,
    API_REPOSITORY_KEY.REALM_REPOSITORY,
    repository => repository.getRealmTransactions(path),
    options,
  );
};
