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
    isPreviousData,
  } = useGetBlockEventsByHeight(params);

  const items = apiData?.items;
  const events = React.useMemo<GnoEvent[]>(
    () => (items ? BlockMapper.blockEventsFromApiResponses(items) : []),
    [items],
  );

  return {
    data: events,
    totalCount: apiData?.page.totalCount,
    hasNext: apiData?.page.hasNext,
    isFetched: isApiFetched,
    isLoading: isApiLoading,
    isError: isApiError,
    isPreviousData,
  };
};
