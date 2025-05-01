import { useInfiniteQuery, UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTransactionsRequestParameters } from "@/repositories/api/transaction/request";
import { GetTransactionsResponse } from "@/repositories/api/transaction/response";
import { CommonError } from "@/common/errors";

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

  return useInfiniteQuery({
    queryKey: [QUERY_KEY.getTransactions, params],
    queryFn: ({ pageParam }) => {
      if (!apiTransactionRepository) {
        throw new CommonError("FAILED_INITIALIZE_REPOSITORY", "ApiTransactionRepository");
      }

      return apiTransactionRepository.getTransactions({
        ...params,
        cursor: pageParam,
      });
    },
    getNextPageParam: lastPage => (lastPage.page.hasNext ? lastPage.page.cursor : undefined),
    ...options,
  });
};
