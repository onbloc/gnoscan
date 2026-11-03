import { UseQueryOptions, UseQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTransactionsRequestParameters } from "@/repositories/api/transaction/request";
import { GetTransactionsResponse } from "@/repositories/api/transaction/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY, DEFAULT_LIST_ITEMS_SIZE, CACHE_POLICY } from "@/common/values/query.constant";

/**
 * Basic hooks to get transactions data from the API
 *
 * This hook fetches transactions data directly from the API and returns the data in its original format.
 * Fetches one page; the previous page stays on screen while the next one loads.
 *
 * Notes: This hook provides raw transaction data from the API.
 * Use this when you need to access transaction information with specific query parameters.
 *
 * @param params - API request parameters
 * @param options - @tanstack/react-query options
 * @returns Original transactions data fetched from the API and the status of the query
 */
export const useGetTransactions = (
  params: GetTransactionsRequestParameters = {},
  options?: UseQueryOptions<GetTransactionsResponse, Error, GetTransactionsResponse>,
): UseQueryResult<GetTransactionsResponse, Error> => {
  const { apiTransactionRepository } = useServiceProvider();

  return useApiRepositoryQuery<GetTransactionsResponse, Error, typeof apiTransactionRepository>(
    [QUERY_KEY.getTransactions, params],
    apiTransactionRepository,
    API_REPOSITORY_KEY.TRANSACTION_REPOSITORY,
    repository =>
      repository!.getTransactions({
        ...params,
        limit: DEFAULT_LIST_ITEMS_SIZE,
      }),
    {
      ...CACHE_POLICY.LIVE,
      keepPreviousData: true,
      ...options,
    },
  );
};
