import { useQuery, UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTransactionContractsResponse } from "@/repositories/api/transaction/response";
import { CommonError } from "@/common/errors";

/**
 * Basic hooks to get transaction contracts data for a specific transaction hash from the API
 *
 * This hook fetches contract data associated with a specific transaction hash directly from the API
 * and returns the data in its original format. It retrieves all contract interactions
 * that occurred within the specified transaction.
 *
 * Notes: This hook provides raw contract data from the API.
 * Use this when you need to access contract interaction details for a specific transaction.
 *
 * @param hash - The transaction hash to query contract data for
 * @param options - @tanstack/react-query options
 * @returns Original contract data associated with the specified transaction hash and the status of the query
 */
export const useGetTransactionContractsByHeight = (
  hash: string,
  options?: UseQueryOptions<GetTransactionContractsResponse, Error>,
) => {
  const { apiTransactionRepository } = useServiceProvider();

  return useQuery({
    queryKey: [QUERY_KEY.getTransactionContractsByHash, hash],
    queryFn: () => {
      if (!apiTransactionRepository) {
        throw new CommonError("FAILED_INITIALIZE_REPOSITORY", "ApiTransactionRepository");
      }

      return apiTransactionRepository.getTransactionContracts(hash);
    },
    ...options,
  });
};
