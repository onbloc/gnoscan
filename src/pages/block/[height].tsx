"use client";

import React from "react";

import { useRouter } from "@/common/hooks/common/use-router";

import BlockLayout from "@/layouts/block/BlockLayout";
const BlockSummaryContainer = React.lazy(
  () => import("@/containers/block/block-summary-container/BlockSummaryContainer"),
);
const BlockInfoContainer = React.lazy(() => import("@/containers/block/block-info-container/BlockInfoContainer"));

const BlockDetails = () => {
  const router = useRouter();
  const { height } = router.query;
  const blockHeight = Number(height);

  return (
    <>
      <BlockLayout
        blockHeight={blockHeight}
        blockSummary={<BlockSummaryContainer blockHeight={blockHeight} />}
        blockInfo={<BlockInfoContainer blockHeight={blockHeight} />}
      />
    </>
  );
};

export default BlockDetails;
