import React from "react";

import { useGetBlocks } from "@/common/react-query/block/api";

import { GetBlocksRequestParameters } from "@/repositories/block/request";
import { Block } from "@/types/data-type";
import { BlockMapper } from "@/common/mapper/block/block-mapper";

/**
 * Hooks to map block data fetched from the API to the format used by the application
 *
 * This hook has the following data flow:
 * 1. useGetBlocks to get the original block data from the API.
 * 2. mapping the fetched data into application format using BlockMapper whenever it changes
 * 3. return the mapped data and the correct loading status
 *
 * This hook allows you to use the mapping logic directly in your component without having to handle it yourself
 * you can use data that is already mapped out of the box.
 *
 * @param params - API request parameters
 * @returns Mapped block data and query status
 */
export const useMappedApiBlocks = (params?: GetBlocksRequestParameters) => {
  const {
    data: apiData,
    isFetched: isApiFetched,
    isLoading: isApiLoading,
    isError: isApiError,
    fetchNextPage,
    hasNextPage,
  } = useGetBlocks(params);

  const [blocks, setBlocks] = React.useState<Block[]>([]);
  const [isDataReady, setIsDataReady] = React.useState(false);

  React.useEffect(() => {
    if (apiData?.pages) {
      setIsDataReady(false);

      const allItems = apiData.pages.flatMap(page => page.items);
      const mappedBlocksData = BlockMapper.fromApiResponses(allItems);

      setBlocks(mappedBlocksData);
      setIsDataReady(true);
    } else {
      setBlocks([]);
      setIsDataReady(true);
    }
  }, [apiData?.pages]);

  const isLoading = isApiLoading || !isDataReady;
  const isFetched = isApiFetched && isDataReady;

  return {
    data: blocks,
    isFetched,
    isLoading,
    isError: isApiError,
    fetchNextPage,
    hasNextPage,
  };
};
