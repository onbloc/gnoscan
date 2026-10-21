import React from "react";

import { useGetTransactions } from "@/common/react-query/transaction/api";

import { StandardNetworkTransactionListTable } from "../transaction-list-table/standard-network/StandardNetworkTransactionListTable";

const StandardNetworkTransactionData = () => {
  const { data, hasNextPage, isFetched, isLoading, fetchNextPage } = useGetTransactions();

  const transactionListData = React.useMemo(() => {
    if (!data) {
      return [];
    }
    const allItems = data.pages.flatMap(page => page.items);
    return allItems;
  }, [data]);

  return (
    <StandardNetworkTransactionListTable
      transactions={transactionListData}
      hasNextPage={hasNextPage}
      isFetched={isFetched}
      isLoading={isLoading}
      nextPage={fetchNextPage}
    />
  );
};

export default StandardNetworkTransactionData;
