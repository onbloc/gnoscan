import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetBlockResponse } from "@/repositories/api/block/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
import { isValidBlockHeight } from "@/common/utils/string-util";

/**
 * Basic hooks to get specific block data by height from the API
 *
 * This hook fetches block data for a specific height directly from the API and returns the data in its original format.
 * It uses a single query to retrieve the block information for the given height.
 *
 * Notes: This hook provides raw block data from the API without any transformation.
 *
 * @param height - The height of the block to fetch.
 * @param optoins - @tanstack/react-query options
 * @returns The block data for the specified height.
 */
export const useGetBlockByHeight = (
  height: string,
  options?: UseQueryOptions<GetBlockResponse, Error, GetBlockResponse>,
) => {
  const { apiBlockRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getBlockByHeight, height],
    apiBlockRepository,
    API_REPOSITORY_KEY.BLOCK_REPOSITORY,
    repository => repository.getBlock(height),
    { enabled: isValidBlockHeight(height) && options?.enabled !== false },
  );
};
