import React from "react";

import { useGetBlockByHeight } from "@/common/react-query/block/api";
import { BlockMapper } from "@/common/mapper/block/block-mapper";
import { BlockSummaryInfo } from "@/types/data-type";
import { useGetLatestBlockHeightQuery } from "@/common/react-query/block";

export const INITIAL_BLOCK_SUMMARY_STATE: BlockSummaryInfo = {
  timeStamp: {
    time: "",
    passedTime: undefined,
  },
  network: "",
  blockHeight: null,
  blockHeightStr: undefined,
  transactions: undefined,
  numberOfTransactions: "0",
  gas: "0",
  proposerAddress: "",
};

/**
 * Hooks to map block-detail data fetched from the API to the format used by the application
 *
 * This hook has the following data flow:
 * 1. useGetBlockByHeight to get the original block data from the API.
 * 2. mapping the fetched data into application format using BlockMapper whenever it changes
 * 3. return the mapped data and the correct loading status
 *
 * This hook allows you to use the mapping logic directly in your component without having to handle it yourself
 * you can use data that is already mapped out of the box.
 *
 * @param params - API request parameters
 * @returns Mapped block data and query status
 */
export const useMappedApiBlock = (height: string) => {
  const {
    data: apiData,
    isFetched: isApiFetched,
    isLoading: isApiLoading,
    isError: isApiError,
  } = useGetBlockByHeight(height);

  const { data: latestBlockHeight } = useGetLatestBlockHeightQuery();
  const hasData = Boolean(apiData?.data);

  const block = React.useMemo<BlockSummaryInfo>(() => {
    if (!isApiFetched || !apiData?.data) {
      return INITIAL_BLOCK_SUMMARY_STATE;
    }

    const mappedBlock = BlockMapper.blockFromApiResponse(apiData.data);
    const blockHeight = mappedBlock.blockHeight || 0;

    return {
      ...mappedBlock,
      hasPreviousBlock: blockHeight > 1,
      hasNextBlock: latestBlockHeight ? blockHeight < latestBlockHeight : true,
    };
  }, [apiData, isApiFetched, latestBlockHeight]);

  return {
    data: block,
    isFetched: isApiFetched,
    isLoading: isApiLoading,
    isError: isApiError,
    hasData,
  };
};
