import { UseQueryOptions, UseQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetBlockTransactionsRequest } from "@/repositories/api/block/request";
import { GetBlockTransactionsResponse } from "@/repositories/api/block/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY, DEFAULT_LIST_ITEMS_SIZE } from "@/common/values/query.constant";
import { isValidBlockHeight } from "@/common/utils/string-util";

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
  params: GetBlockTransactionsRequest,
  options?: UseQueryOptions<GetBlockTransactionsResponse, Error, GetBlockTransactionsResponse>,
): UseQueryResult<GetBlockTransactionsResponse, Error> => {
  const { apiBlockRepository } = useServiceProvider();

  return useApiRepositoryQuery<GetBlockTransactionsResponse, Error, typeof apiBlockRepository>(
    [QUERY_KEY.getBlockTransactionsByHeight, params],
    apiBlockRepository,
    API_REPOSITORY_KEY.BLOCK_REPOSITORY,
    repository =>
      repository!.getBlockTransactions({
        ...params,
        limit: params.limit ?? DEFAULT_LIST_ITEMS_SIZE,
      }),
    {
      keepPreviousData: true,
      ...options,
      enabled: isValidBlockHeight(params.blockHeight) && options?.enabled !== false,
    },
  );
};
