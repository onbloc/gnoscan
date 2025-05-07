"use client";

import React from "react";

import { useRouter } from "@/common/hooks/common/use-router";

import BlockLayout from "@/layouts/block/BlockLayout";
import BlockSummaryContainer from "@/containers/block/block-summary-container/BlockSummaryContainer";
import BlockInfoContainer from "@/containers/block/block-info-container/BlockInfoContainer";

export default function Page() {
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
}
