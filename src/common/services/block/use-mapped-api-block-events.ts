import React from "react";

import { useGetBlockEventsByHeight } from "@/common/react-query/block/api";
import { GnoEvent } from "@/types/data-type";
import { BlockMapper } from "@/common/mapper/block/block-mapper";
import { GetBlockEventsRequest } from "@/repositories/api/block/request";

/**
 * Hooks to map block-events data fetched from the API to the format used by the application
 *
 * This hook has the following data flow:
 * 1. useGetBlockEventsByHeight to get the original block-events data from the API.
 * 2. mapping the fetched data into application format using BlockMapper whenever it changes
 * 3. return the mapped data and the correct loading status
 *
 * This hook allows you to use the mapping logic directly in your component without having to handle it yourself
 * you can use data that is already mapped out of the box.
 *
 * @param params - API request parameters
 * @returns Mapped block data and query status
 */
export const useMappedApiBlockEvents = (params: GetBlockEventsRequest) => {
  const {
    data: apiData,
    isFetched: isApiFetched,
    isLoading: isApiLoading,
    isError: isApiError,
    fetchNextPage,
    hasNextPage,
  } = useGetBlockEventsByHeight(params);

  const pages = apiData?.pages;
  const events = React.useMemo<GnoEvent[]>(
    () => (pages ? BlockMapper.blockEventsFromApiResponses(pages.flatMap(page => page.items)) : []),
    [pages],
  );

  // The API returns the total event count only on the first page.
  const totalCount = apiData?.pages?.[0]?.page?.totalCount;

  return {
    data: events,
    totalCount,
    isFetched: isApiFetched,
    isLoading: isApiLoading,
    isError: isApiError,
    fetchNextPage,
    hasNextPage,
  };
};
