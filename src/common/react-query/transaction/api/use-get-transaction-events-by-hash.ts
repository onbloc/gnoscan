import { UseQueryOptions, UseQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTransactionEventsRequest } from "@/repositories/api/transaction/request";
import { GetTransactionEventsResponse } from "@/repositories/api/transaction/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY, DEFAULT_LIST_ITEMS_SIZE } from "@/common/values/query.constant";

/**
 * Basic hooks to get transaction events data for a specific transaction hash from the API
 *
 * This hook fetches event data associated with a specific transaction hash directly from the API
 * and returns the data in its original format. It retrieves all events that were emitted
 * during the transaction execution.
 *
 * Notes: This hook provides raw event data from the API.
 * Use this when you need to access event logs and details for a specific transaction.
 *
 * @param hash - The transaction hash to query event data for
 * @param options - @tanstack/react-query options
 * @returns Original event data associated with the specified transaction hash and the status of the query
 */
export const useGetTransactionEventsByHeight = (
  params: GetTransactionEventsRequest,
  options?: UseQueryOptions<GetTransactionEventsResponse, Error, GetTransactionEventsResponse>,
): UseQueryResult<GetTransactionEventsResponse, Error> => {
  const { apiTransactionRepository } = useServiceProvider();

  return useApiRepositoryQuery<GetTransactionEventsResponse, Error, typeof apiTransactionRepository>(
    [QUERY_KEY.getTransactionEventsByHash, params],
    apiTransactionRepository,
    API_REPOSITORY_KEY.TRANSACTION_REPOSITORY,
    repository =>
      repository!.getTransactionEvents({
        ...params,
        limit: params.limit ?? DEFAULT_LIST_ITEMS_SIZE,
      }),
    {
      keepPreviousData: true,
      ...options,
      enabled: (options?.enabled ?? true) && !!params.txHash,
    },
  );
};
