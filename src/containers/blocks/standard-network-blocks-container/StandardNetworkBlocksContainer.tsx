import React from "react";

import { useFirstPageOnFilterChange } from "@/common/hooks/common/use-function-filtered-paged-list";
import { useListPageSize } from "@/common/hooks/common/use-list-page-size";
import { useListPagination } from "@/common/hooks/common/use-list-pagination";
import { ListCsv, usePublishListCsv } from "@/common/hooks/common/use-publish-list-csv";
import { useAdoptSnapshotHeight, useSnapshotHeight } from "@/common/hooks/common/use-snapshot-height";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useMappedApiBlocks } from "@/common/services/block/use-mapped-api-blocks";
import { BLOCK_CSV_HEADER, toBlockCsvRow } from "@/common/utils/csv-rows.utility";

import { StandardNetworkBlockDatatable } from "@/components/view/datatable/block/StandardNetworkBlockDatatable";
import { ListFooter } from "@/components/view/common/list-footer/ListFooter";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";

interface StandardNetworkBlocksContainerProps {
  // Receives the page on screen as CSV, for the download button of the page title.
  onCsvChange?: (csv: ListCsv | null) => void;
}

const StandardNetworkBlocks = ({ onCsvChange }: StandardNetworkBlocksContainerProps) => {
  const [pageSize, setPageSize] = useListPageSize("blocks");
  // Another page size lists other pages, so it starts again from page 1.
  const scope = String(pageSize);
  const [page, setPage] = useListPagination("blocks", scope);
  useFirstPageOnFilterChange(scope, setPage);
  const snapshot = useSnapshotHeight(page);
  const { data, items, isFetched, isLoading, isError, isPreviousData, hasNext, totalCount, snapshotHeight } =
    useMappedApiBlocks({ page, snapshotHeight: snapshot.height, limit: pageSize });
  useAdoptSnapshotHeight(snapshot.adopt, snapshotHeight, !isPreviousData);

  const csv = React.useMemo<ListCsv>(
    () => ({
      name: "blocks",
      header: BLOCK_CSV_HEADER,
      rows: (items ?? []).map(toBlockCsvRow),
      page,
      isSettled: !isPreviousData,
    }),
    [items, page, isPreviousData],
  );
  usePublishListCsv(csv, onCsvChange);

  if (isLoading || !isFetched) return <TableSkeleton />;

  return (
    <StandardNetworkBlockDatatable
      data={data}
      isError={isError}
      footer={
        <ListFooter
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          hasNext={hasNext}
          isSettled={!isPreviousData}
          scope={scope}
          onChangePage={setPage}
          onChangePageSize={setPageSize}
        />
      }
    />
  );
};

const StandardNetworkBlocksContainer = ({ onCsvChange }: StandardNetworkBlocksContainerProps) => {
  const { currentNetwork } = useNetworkProvider();

  // Remount on network change so keepPreviousData does not show the previous network's rows
  return <StandardNetworkBlocks key={currentNetwork?.chainId} onCsvChange={onCsvChange} />;
};

export default StandardNetworkBlocksContainer;
