import { useQuery, UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetBlockEventsResponse } from "@/repositories/api/block/response";
import { CommonError } from "@/common/errors";

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
export const useGetBlockEventsByHeight = (height: string, options?: UseQueryOptions<GetBlockEventsResponse, Error>) => {
  const { apiBlockRepository } = useServiceProvider();

  return useQuery({
    queryKey: [QUERY_KEY.getBlockEventsByHeight, height],
    queryFn: () => {
      if (!apiBlockRepository) {
        throw new CommonError("FAILED_INITIALIZE_REPOSITORY", "ApiBlockRepository");
      }

      return apiBlockRepository.getBlockEvents(height);
    },
    ...options,
  });
};
