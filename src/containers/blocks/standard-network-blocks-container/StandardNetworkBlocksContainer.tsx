import React from "react";

import { useMappedApiBlocks } from "@/common/services/block/use-mapped-api-blocks";

import { StandardNetworkBlockDatatable } from "@/components/view/datatable/block/StandardNetworkBlockDatatable";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";

const StandardNetworkBlocksContainer = () => {
  const { data, isFetched, isLoading, isError, hasNextPage, fetchNextPage } = useMappedApiBlocks();

  if (isLoading || !isFetched) return <TableSkeleton />;

  return (
    <StandardNetworkBlockDatatable
      data={data}
      isError={isError}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
};

export default StandardNetworkBlocksContainer;
