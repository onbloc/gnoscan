import React from "react";

import { useListPagination } from "@/common/hooks/common/use-list-pagination";
import { useAdoptSnapshotHeight, useSnapshotHeight } from "@/common/hooks/common/use-snapshot-height";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useMappedApiBlocks } from "@/common/services/block/use-mapped-api-blocks";
import { DEFAULT_LIST_ITEMS_SIZE } from "@/common/values/query.constant";

import { StandardNetworkBlockDatatable } from "@/components/view/datatable/block/StandardNetworkBlockDatatable";
import { ListPagination } from "@/components/view/common/list-pagination/ListPagination";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";

const StandardNetworkBlocks = () => {
  const [page, setPage] = useListPagination("blocks");
  const snapshot = useSnapshotHeight(page);
  const { data, isFetched, isLoading, isError, isPreviousData, hasNext, totalCount, snapshotHeight } =
    useMappedApiBlocks({ page, snapshotHeight: snapshot.height });
  useAdoptSnapshotHeight(snapshot.adopt, snapshotHeight, !isPreviousData);

  if (isLoading || !isFetched) return <TableSkeleton />;

  return (
    <StandardNetworkBlockDatatable
      data={data}
      isError={isError}
      footer={
        <ListPagination
          page={page}
          pageSize={DEFAULT_LIST_ITEMS_SIZE}
          totalCount={totalCount}
          hasNext={hasNext}
          isSettled={!isPreviousData}
          onChangePage={setPage}
        />
      }
    />
  );
};

const StandardNetworkBlocksContainer = () => {
  const { currentNetwork } = useNetworkProvider();

  // Remount on network change so keepPreviousData does not show the previous network's rows
  return <StandardNetworkBlocks key={currentNetwork?.chainId} />;
};

export default StandardNetworkBlocksContainer;
