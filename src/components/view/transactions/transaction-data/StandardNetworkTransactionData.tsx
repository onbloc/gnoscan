import React from "react";

import { useGetTransactions } from "@/common/react-query/transaction/api";
import { useTransactionFilter } from "@/common/hooks/transactions/use-transaction-filter";
import { TransactionFilterBar } from "@/components/view/datatable/transaction-filter/TransactionFilterBar";

import { StandardNetworkTransactionListTable } from "../transaction-list-table/standard-network/StandardNetworkTransactionListTable";

const StandardNetworkTransactionData = () => {
  const { input, setInput, params, isFiltered } = useTransactionFilter("transactions:filter");
  // keepPreviousData keeps the current rows on screen while a new filter loads.
  const { data, hasNextPage, isFetched, isLoading, fetchNextPage } = useGetTransactions(params, {
    keepPreviousData: true,
  });

  const transactionListData = React.useMemo(() => {
    if (!data) {
      return [];
    }
    const allItems = data.pages.flatMap(page => page.items);
    return allItems;
  }, [data]);

  return (
    <>
      <TransactionFilterBar
        value={input}
        onChange={setInput}
        resultCount={isFiltered ? data?.pages[0]?.page.totalCount : undefined}
      />
      <StandardNetworkTransactionListTable
        transactions={transactionListData}
        hasNextPage={hasNextPage}
        isFetched={isFetched}
        isLoading={isLoading}
        nextPage={fetchNextPage}
      />
    </>
  );
};

export default StandardNetworkTransactionData;
