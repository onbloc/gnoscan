import React from "react";

import { useListPagination } from "@/common/hooks/common/use-list-pagination";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useGetTransactions } from "@/common/react-query/transaction/api";
import { DEFAULT_LIST_ITEMS_SIZE } from "@/common/values/query.constant";

import { ListPagination } from "@/components/view/common/list-pagination/ListPagination";
import { StandardNetworkTransactionListTable } from "../transaction-list-table/standard-network/StandardNetworkTransactionListTable";

const StandardNetworkTransactions = () => {
  const [page, setPage] = useListPagination("transactions");
  const { data, isFetched, isLoading, isPreviousData } = useGetTransactions({ page });

  return (
    <StandardNetworkTransactionListTable
      transactions={data?.items ?? []}
      isFetched={isFetched}
      isLoading={isLoading}
      footer={
        <ListPagination
          page={page}
          pageSize={DEFAULT_LIST_ITEMS_SIZE}
          totalCount={data?.page.totalCount}
          hasNext={data?.page.hasNext}
          isSettled={!isPreviousData}
          onChangePage={setPage}
        />
      }
    />
  );
};

const StandardNetworkTransactionData = () => {
  const { currentNetwork } = useNetworkProvider();

  // Remount on network change so keepPreviousData does not show the previous network's rows
  return <StandardNetworkTransactions key={currentNetwork?.chainId} />;
};

export default StandardNetworkTransactionData;
