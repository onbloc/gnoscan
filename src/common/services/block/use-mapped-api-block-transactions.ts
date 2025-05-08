import React from "react";

import { useGetBlockTransactionsByHeight } from "@/common/react-query/block/api";
import { Transaction } from "@/types/data-type";
import { BlockMapper } from "@/common/mapper/block/block-mapper";

/**
 * Hooks to map block-transactions data fetched from the API to the format used by the application
 *
 * This hook has the following data flow:
 * 1. useGetBlockTransactionsByHeight to get the original block-transactions data from the API.
 * 2. mapping the fetched data into application format using BlockMapper whenever it changes
 * 3. return the mapped data and the correct loading status
 *
 * This hook allows you to use the mapping logic directly in your component without having to handle it yourself
 * you can use data that is already mapped out of the box.
 *
 * @param params - API request parameters
 * @returns Mapped block data and query status
 */
export const useMappedApiBlockTransactions = (height: string) => {
  const {
    data: apiData,
    isFetched: isApiFetched,
    isLoading: isApiLoading,
    isError: isApiError,
  } = useGetBlockTransactionsByHeight(height);

  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [isDataReady, setIsDataReady] = React.useState(false);

  React.useEffect(() => {
    if (apiData?.items) {
      setIsDataReady(false);

      const allItems = apiData.items;
      const mappedBlocksData = BlockMapper.blockTransactionsFromApiResponses(allItems);

      setTransactions(mappedBlocksData);
      setIsDataReady(true);
    } else {
      setTransactions([]);
      setIsDataReady(true);
    }
  }, [apiData?.items]);

  const isLoading = isApiLoading || !isDataReady;
  const isFetched = isApiFetched && isDataReady;

  return {
    data: transactions,
    isFetched,
    isLoading,
    isError: isApiError,
  };
};
