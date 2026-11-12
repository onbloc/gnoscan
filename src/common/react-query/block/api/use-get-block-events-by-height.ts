import { UseQueryOptions, UseQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetBlockEventsRequest } from "@/repositories/api/block/request";
import { GetBlockEventsResponse } from "@/repositories/api/block/response";
import { useApiRepositoryPageQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
import { isValidBlockHeight } from "@/common/utils/string-util";
/**
 * Basic hooks to get block events data for a specific height from the API
 * 
 * This hook fetches block events data for a specific blockchain height directly from the API 
 * and returns the data in its original format. It retrieves all events that occurred 
 * within the specified block
 * 
 * Notes: This hook provides raw block events data from the API.

 * @param height - The height of the block to fetch.
 * @param optoins - @tanstack/react-query options
 * @returns The block events data for the specified height.
 */
export const useGetBlockEventsByHeight = (
  params: GetBlockEventsRequest,
  options?: UseQueryOptions<GetBlockEventsResponse, Error, GetBlockEventsResponse>,
) => {
  const { apiBlockRepository } = useServiceProvider();

  return useApiRepositoryPageQuery(
    [QUERY_KEY.getBlockEventsByHeight],
    params,
    apiBlockRepository,
    API_REPOSITORY_KEY.BLOCK_REPOSITORY,
    (repository, pageParams) => repository.getBlockEvents(pageParams),
    { ...options, enabled: isValidBlockHeight(params.blockHeight) && options?.enabled !== false },
  );
};
