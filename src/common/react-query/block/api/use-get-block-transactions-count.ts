import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetBlockTransactionsCountResponse } from "@/repositories/api/block/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
import { isValidBlockHeight } from "@/common/utils/string-util";

/**
 * Basic hooks to get the live transaction count for a specific block height from the API
 *
 * @param height - The height of the block to fetch the transaction count for.
 * @param options - @tanstack/react-query options
 * @returns The transaction count for the specified height.
 */
export const useGetBlockTransactionsCount = (
  height: string,
  options?: UseQueryOptions<GetBlockTransactionsCountResponse, Error, GetBlockTransactionsCountResponse>,
) => {
  const { apiBlockRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getBlockTransactionsCountByHeight, height],
    apiBlockRepository,
    API_REPOSITORY_KEY.BLOCK_REPOSITORY,
    repository => repository.getBlockTransactionsCount(height),
    { ...options, enabled: isValidBlockHeight(height) && options?.enabled !== false },
  );
};
