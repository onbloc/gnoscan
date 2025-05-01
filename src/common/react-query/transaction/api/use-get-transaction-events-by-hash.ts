import { useQuery, UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTransactionEventsResponse } from "@/repositories/api/transaction/response";
import { CommonError } from "@/common/errors";

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
  hash: string,
  options?: UseQueryOptions<GetTransactionEventsResponse, Error>,
) => {
  const { apiTransactionRepository } = useServiceProvider();

  return useQuery({
    queryKey: [QUERY_KEY.getTransactionEventsByHash, hash],
    queryFn: () => {
      if (!apiTransactionRepository) {
        throw new CommonError("FAILED_INITIALIZE_REPOSITORY", "ApiTransactionRepository");
      }

      return apiTransactionRepository.getTransactionEvents(hash);
    },
    ...options,
  });
};
