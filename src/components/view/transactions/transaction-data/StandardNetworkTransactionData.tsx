import React from "react";

import { useFirstPageOnFilterChange } from "@/common/hooks/common/use-function-filtered-paged-list";
import { useListPageSize } from "@/common/hooks/common/use-list-page-size";
import { useListPagination } from "@/common/hooks/common/use-list-pagination";
import { ListCsv, usePublishListCsv } from "@/common/hooks/common/use-publish-list-csv";
import { useAdoptSnapshotHeight, useSnapshotHeight } from "@/common/hooks/common/use-snapshot-height";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useGetTransactions } from "@/common/react-query/transaction/api";
import { FunctionFilterValue } from "@/common/types/function-filter";
import { TRANSACTION_CSV_HEADER, toTransactionCsvRow } from "@/common/utils/csv-rows.utility";
import { getFunctionFilterScope, toFunctionFilterApiParams } from "@/common/utils/function-filter.utility";

import { ListFooter } from "@/components/view/common/list-footer/ListFooter";
import { StandardNetworkTransactionListTable } from "../transaction-list-table/standard-network/StandardNetworkTransactionListTable";

interface StandardNetworkTransactionDataProps {
  filter: FunctionFilterValue;
  // Receives the page on screen as CSV, for the download button of the page title.
  onCsvChange?: (csv: ListCsv | null) => void;
}

const StandardNetworkTransactions = ({ filter, onCsvChange }: StandardNetworkTransactionDataProps) => {
  const [pageSize, setPageSize] = useListPageSize("transactions");
  // A different filter or page size lists other pages, so it starts again from page 1. The order of the labels is not part of it.
  const scope = `${getFunctionFilterScope(filter)}|${pageSize}`;
  const [page, setPage] = useListPagination("transactions", scope);

  useFirstPageOnFilterChange(scope, setPage);
  const snapshot = useSnapshotHeight(page);
  const { data, isFetched, isLoading, isPreviousData } = useGetTransactions({
    ...toFunctionFilterApiParams(filter),
    page,
    limit: pageSize,
    snapshotHeight: snapshot.height,
  });
  useAdoptSnapshotHeight(snapshot.adopt, data?.page.snapshotHeight, !isPreviousData);

  const items = data?.items;
  const csv = React.useMemo<ListCsv>(
    () => ({
      name: "transactions",
      header: TRANSACTION_CSV_HEADER,
      rows: (items ?? []).map(toTransactionCsvRow),
      page,
      isSettled: !isPreviousData,
    }),
    [items, page, isPreviousData],
  );
  usePublishListCsv(csv, onCsvChange);

  return (
    <StandardNetworkTransactionListTable
      transactions={items ?? []}
      // Rows of the previous page stay on screen until the next page loads.
      isFetched={isFetched || isPreviousData}
      isLoading={isLoading}
      footer={
        <ListFooter
          page={page}
          pageSize={pageSize}
          totalCount={data?.page.totalCount}
          hasNext={data?.page.hasNext}
          isSettled={!isPreviousData}
          scope={scope}
          onChangePage={setPage}
          onChangePageSize={setPageSize}
        />
      }
    />
  );
};

const StandardNetworkTransactionData = ({ filter, onCsvChange }: StandardNetworkTransactionDataProps) => {
  const { currentNetwork } = useNetworkProvider();

  // Remount on network change so keepPreviousData does not show the previous network's rows
  return <StandardNetworkTransactions key={currentNetwork?.chainId} filter={filter} onCsvChange={onCsvChange} />;
};

export default StandardNetworkTransactionData;
