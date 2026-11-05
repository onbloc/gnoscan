import React from "react";

import { useListPagination } from "@/common/hooks/common/use-list-pagination";
import { useAdoptSnapshotHeight, useSnapshotHeight } from "@/common/hooks/common/use-snapshot-height";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useGetTransactions } from "@/common/react-query/transaction/api";
import { TransactionFunctionFilter } from "@/repositories/api/transaction/request";
import { DEFAULT_LIST_ITEMS_SIZE } from "@/common/values/query.constant";

import { ListPagination } from "@/components/view/common/list-pagination/ListPagination";
import { StandardNetworkTransactionListTable } from "../transaction-list-table/standard-network/StandardNetworkTransactionListTable";

interface StandardNetworkTransactionDataProps {
  filter?: TransactionFunctionFilter;
}

const StandardNetworkTransactions = ({ filter }: StandardNetworkTransactionDataProps) => {
  // A different filter lists other transactions, so it starts again from page 1.
  const scope = filter ? Object.entries(filter).join(":") : "";
  const [page, setPage] = useListPagination("transactions", scope);
  const snapshot = useSnapshotHeight(page);
  const { data, isFetched, isLoading, isPreviousData } = useGetTransactions({
    ...filter,
    page,
    snapshotHeight: snapshot.height,
  });
  useAdoptSnapshotHeight(snapshot.adopt, data?.page.snapshotHeight, !isPreviousData);

  return (
    <StandardNetworkTransactionListTable
      transactions={data?.items ?? []}
      // Rows of the previous page stay on screen until the next page loads.
      isFetched={isFetched || isPreviousData}
      isLoading={isLoading}
      footer={
        <ListPagination
          page={page}
          pageSize={DEFAULT_LIST_ITEMS_SIZE}
          totalCount={data?.page.totalCount}
          hasNext={data?.page.hasNext}
          isSettled={!isPreviousData}
          scope={scope}
          onChangePage={setPage}
        />
      }
    />
  );
};

const StandardNetworkTransactionData = ({ filter }: StandardNetworkTransactionDataProps) => {
  const { currentNetwork } = useNetworkProvider();

  // Remount on network change so keepPreviousData does not show the previous network's rows
  return <StandardNetworkTransactions key={currentNetwork?.chainId} filter={filter} />;
};

export default StandardNetworkTransactionData;
