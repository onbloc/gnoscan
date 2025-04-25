import React from "react";

import { useBlocks } from "@/common/hooks/blocks/use-blocks";
import { useWindowSize } from "@/common/hooks/use-window-size";

import { BlockDatatable } from "@/components/view/datatable";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";

const BlockListContainer = () => {
  const { breakpoint } = useWindowSize();
  const { data: blocks, isFetched, fetchNextPage, hasNextPage, isError, isLoading } = useBlocks();

  if (isLoading || !isFetched) return <TableSkeleton />;

  return (
    <BlockDatatable
      breakpoint={breakpoint}
      data={blocks}
      isFetched={isFetched}
      isError={isError}
      isLoading={isLoading}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
};

export default BlockListContainer;
