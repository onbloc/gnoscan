import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetBlockTransactionsRequest } from "@/repositories/api/block/request";
import { GetBlockTransactionsResponse } from "@/repositories/api/block/response";
import { useApiRepositoryInfiniteQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
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
  options?: UseInfiniteQueryOptions<GetBlockTransactionsResponse, Error, GetBlockTransactionsResponse>,
): UseInfiniteQueryResult<GetBlockTransactionsResponse, Error> => {
  const { apiBlockRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<GetBlockTransactionsResponse, Error, typeof apiBlockRepository>(
    [QUERY_KEY.getBlockTransactionsByHeight, params],
    apiBlockRepository,
    API_REPOSITORY_KEY.BLOCK_REPOSITORY,
    (repository, pageParam) =>
      repository!.getBlockTransactions({
        ...params,
        cursor: pageParam as string | undefined,
      }),
    {
      ...options,
      getNextPageParam: lastPage => (lastPage.page.hasNext ? lastPage.page.cursor : undefined),
      enabled: isValidBlockHeight(params.blockHeight) && options?.enabled !== false,
    },
  );
};
