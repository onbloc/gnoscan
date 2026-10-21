import React from "react";

import { useGetBlockTransactionsByHeight, useGetBlockTransactionsCount } from "@/common/react-query/block/api";
import { Transaction } from "@/types/data-type";
import { BlockMapper } from "@/common/mapper/block/block-mapper";
import { GetBlockTransactionsRequest } from "@/repositories/api/block/request";

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
export const useMappedApiBlockTransactions = (params: GetBlockTransactionsRequest) => {
  const {
    data: apiData,
    isFetched: isApiFetched,
    isLoading: isApiLoading,
    isError: isApiError,
    fetchNextPage,
    hasNextPage,
  } = useGetBlockTransactionsByHeight(params);

  const { data: countData } = useGetBlockTransactionsCount(params.blockHeight);

  const pages = apiData?.pages;
  const transactions = React.useMemo<Transaction[]>(
    () => (pages ? BlockMapper.blockTransactionsFromApiResponses(pages.flatMap(page => page.items)) : []),
    [pages],
  );

  const totalCount = countData?.totalCount;

  return {
    data: transactions,
    totalCount,
    isFetched: isApiFetched,
    isLoading: isApiLoading,
    isError: isApiError,
    fetchNextPage,
    hasNextPage,
  };
};
