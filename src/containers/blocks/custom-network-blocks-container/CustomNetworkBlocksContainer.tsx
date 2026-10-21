import React from "react";

import { useBlocks } from "@/common/hooks/blocks/use-blocks";

import { BlockDatatable } from "@/components/view/datatable";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";

const CustomNetworkBlocksContainer = () => {
  const { data: blocks, isFetched, fetchNextPage, hasNextPage, isError, isLoading } = useBlocks();

  if (isLoading || !isFetched) return <TableSkeleton />;

  return <BlockDatatable data={blocks} isError={isError} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} />;
};

export default CustomNetworkBlocksContainer;
