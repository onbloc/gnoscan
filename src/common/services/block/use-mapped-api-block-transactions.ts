import React from "react";

import { useFunctionFilteredPagedList } from "@/common/hooks/common/use-function-filtered-paged-list";
import { FunctionFilterValue } from "@/common/types/function-filter";
import { useGetBlockTransactionsByHeight } from "@/common/react-query/block/api";
import { Transaction } from "@/types/data-type";
import { BlockMapper } from "@/common/mapper/block/block-mapper";

/**
 * Hooks to map block-transactions data fetched from the API to the format used by the application
 *
 * This hook has the following data flow:
 * 1. useFunctionFilteredPagedList to get one page of the original block-transactions data from the API.
 * 2. mapping the fetched data into application format using BlockMapper whenever it changes
 * 3. return the mapped data, the footer props of the page and the correct loading status
 *
 * @param blockHeight - The height of the block to fetch the transactions of
 * @param filter - Function filter of the list
 * @returns Mapped block transactions and query status
 */
export const useMappedApiBlockTransactions = (blockHeight: string, filter: FunctionFilterValue) => {
  const list = useFunctionFilteredPagedList(
    "block-transactions",
    blockHeight,
    filter,
    useGetBlockTransactionsByHeight,
    {
      blockHeight,
    },
  );

  const transactions = React.useMemo<Transaction[]>(
    () => BlockMapper.blockTransactionsFromApiResponses(list.items),
    [list.items],
  );

  return {
    data: transactions,
    isFetched: list.isFetched,
    pagination: list.pagination,
  };
};
