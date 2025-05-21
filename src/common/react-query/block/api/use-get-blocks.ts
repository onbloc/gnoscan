import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetBlocksRequestParameters } from "@/repositories/api/block/request";
import { GetBlocksResponse } from "@/repositories/api/block/response";
import { useApiRepositoryInfiniteQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY, DEFAULT_LIST_ITEMS_SIZE } from "@/common/values/query.constant";

/**
 * Basic hooks to get block data from the API
 *
 * This hook fetches block data directly from the API and returns the data in its original format.
 * Supports pagination, and additional pages can be loaded as needed.
 *
 * Notes: The source data returned by this hook is found in `use-api-blocks.ts`.
 * mapped to the format used by your application.
 *
 * @param params - API request parameters
 * @param options - @tanstack/react-query options
 * @returns Original block data fetched from the API and the status of the query
 */
export const useGetBlocks = (
  params: GetBlocksRequestParameters = {},
  options?: UseInfiniteQueryOptions<GetBlocksResponse, Error, GetBlocksResponse>,
): UseInfiniteQueryResult<GetBlocksResponse, Error> => {
  const { apiBlockRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<GetBlocksResponse, Error, typeof apiBlockRepository>(
    [QUERY_KEY.getBlocks, params],
    apiBlockRepository,
    API_REPOSITORY_KEY.BLOCK_REPOSITORY,
    (repository, pageParam) =>
      repository!.getBlocks({
        ...params,
        limit: DEFAULT_LIST_ITEMS_SIZE,
        cursor: pageParam as string | undefined,
      }),
    {
      getNextPageParam: lastPage => (lastPage.page.hasNext ? lastPage.page.cursor : undefined),
      ...options,
    },
  );
};
