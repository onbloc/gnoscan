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
  const [block, setBlock] = React.useState<BlockSummaryInfo>(INITIAL_BLOCK_SUMMARY_STATE);
  const [isDataReady, setIsDataReady] = React.useState(false);

  React.useEffect(() => {
    if (isApiFetched && apiData) {
      const mappedBlock = BlockMapper.blockFromApiResponse(apiData.data);

      const blockHeight = mappedBlock.blockHeight || 0;
      const hasPreviousBlock = blockHeight > 1;
      const hasNextBlock = latestBlockHeight ? blockHeight < latestBlockHeight : true;

      setBlock({
        ...mappedBlock,
        hasPreviousBlock,
        hasNextBlock,
      });

      setIsDataReady(true);
    }
  }, [apiData, isApiFetched, latestBlockHeight]);

  const isLoading = isApiLoading || !isDataReady;
  const isFetched = isApiFetched && isDataReady;

  return {
    data: block,
    isFetched,
    isLoading,
    isError: isApiError,
  };
};
