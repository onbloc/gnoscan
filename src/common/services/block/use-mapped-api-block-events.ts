import React from "react";

import { usePagedList } from "@/common/hooks/common/use-paged-list";
import { useGetBlockEventsByHeight } from "@/common/react-query/block/api";
import { GnoEvent } from "@/types/data-type";
import { BlockMapper } from "@/common/mapper/block/block-mapper";

/**
 * Hooks to map block-events data fetched from the API to the format used by the application
 *
 * This hook has the following data flow:
 * 1. usePagedList to get one page of the original block-events data from the API.
 * 2. mapping the fetched data into application format using BlockMapper whenever it changes
 * 3. return the mapped data, the footer props of the page and the correct loading status
 *
 * @param blockHeight - The height of the block to fetch the events of
 * @returns Mapped block events and query status
 */
export const useMappedApiBlockEvents = (blockHeight: string) => {
  const list = usePagedList("block-events", blockHeight, useGetBlockEventsByHeight, { blockHeight });

  const events = React.useMemo<GnoEvent[]>(() => BlockMapper.blockEventsFromApiResponses(list.items), [list.items]);

  return {
    data: events,
    isFetched: list.isFetched,
    pagination: list.pagination,
  };
};
