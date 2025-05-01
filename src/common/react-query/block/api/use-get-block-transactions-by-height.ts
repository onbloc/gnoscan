import { useQuery, UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetBlockTransactionsResponse } from "@/repositories/api/block/response";
import { CommonError } from "@/common/errors";

/**
 * Basic hooks to get block transactions data for a specific height from the API
 * 
 * This hook fetches transaction data for a specific blockchain height directly from the API
 * and returns the data in its original format. It retrieves all transactions that were
 * included in the specified block.
 * 
 * Notes: This hook provides raw block transactions data from the API.

 * @param height - The height of the block to fetch.
 * @param optoins - @tanstack/react-query options
 * @returns The block transactions data for the specified height.
 */
export const useGetBlockTransactionsByHeight = (
  height: string,
  options?: UseQueryOptions<GetBlockTransactionsResponse, Error, GetBlockTransactionsResponse>,
) => {
  const { apiBlockRepository } = useServiceProvider();

  return useQuery({
    queryKey: [QUERY_KEY.getBlockTransactionsByHeight, height],
    queryFn: () => {
      if (!apiBlockRepository) {
        throw new CommonError("FAILED_INITIALIZE_REPOSITORY", "ApiBlockRepository");
      }

      return apiBlockRepository.getBlockTransactions(height);
    },
    ...options,
  });
};
