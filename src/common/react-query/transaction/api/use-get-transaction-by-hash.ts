import { useQuery, UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { CommonError } from "@/common/errors";
import { GetTransactionResponse } from "@/repositories/api/transaction/response";

/**
 * Basic hooks to get transaction data for a specific hash from the API
 *
 * This hook fetches transaction data for a specific transaction hash directly from the API
 * and returns the data in its original format. It retrieves detailed information
 * about a single transaction identified by its hash.
 *
 * Notes: This hook provides raw transaction data from the API.
 * Use this when you need to access detailed information for a specific transaction.
 *
 * @param hash - The transaction hash to query for
 * @param options - @tanstack/react-query options
 * @returns Original transaction data for the specified hash and the status of the query
 */
export const useGetTransactionByHash = (
  hash: string,
  options?: UseQueryOptions<GetTransactionResponse, Error, GetTransactionResponse>,
) => {
  const { apiTransactionRepository } = useServiceProvider();

  return useQuery({
    queryKey: [QUERY_KEY.getTransactionByHash, hash],
    queryFn: () => {
      if (!apiTransactionRepository) {
        throw new CommonError("FAILED_INITIALIZE_REPOSITORY", "ApiTransactionRepository");
      }

      return apiTransactionRepository.getTransaction(hash);
    },
    ...options,
  });
};
