import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTransactionsRequestParameters } from "@/repositories/api/transaction/request";
import { GetTransactionsResponse } from "@/repositories/api/transaction/response";
import { useApiRepositoryInfiniteQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY, DEFAULT_LIST_ITEMS_SIZE } from "@/common/values/query.constant";

/**
 * Basic hooks to get transactions data from the API
 *
 * This hook fetches transactions data directly from the API and returns the data in its original format.
 * It provides a way to query transactions based on the provided parameters.
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
  options?: UseInfiniteQueryOptions<GetTransactionsResponse, Error, GetTransactionsResponse>,
): UseInfiniteQueryResult<GetTransactionsResponse, Error> => {
  const { apiTransactionRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<GetTransactionsResponse, Error, typeof apiTransactionRepository>(
    [QUERY_KEY.getTransactions, params],
    apiTransactionRepository,
    API_REPOSITORY_KEY.TRANSACTION_REPOSITORY,
    (repository, pageParam) =>
      repository!.getTransactions({
        ...params,
        limit: DEFAULT_LIST_ITEMS_SIZE,
        cursor: pageParam as string | undefined,
      }),
    {
      getNextPageParam: lastPage => (lastPage.page.hasNext ? lastPage.page.cursor : undefined),
      ...options,
    },
  );
};
