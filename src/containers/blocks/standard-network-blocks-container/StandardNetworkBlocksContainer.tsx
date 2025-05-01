import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";
import { useMappedApiBlocks } from "@/common/services/block/use-mapped-api-blocks";

import { BlockDatatable } from "@/components/view/datatable";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";

const StandardNetworkBlocksContainer = () => {
  const { breakpoint } = useWindowSize();

  const { data, isFetched, isLoading, isError, hasNextPage, fetchNextPage } = useMappedApiBlocks();

  if (isLoading || !isFetched) return <TableSkeleton />;

  return (
    <BlockDatatable
      breakpoint={breakpoint}
      data={data}
      isFetched={isFetched}
      isError={isError}
      isLoading={isLoading}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
};

export default StandardNetworkBlocksContainer;
