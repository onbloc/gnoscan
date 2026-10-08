import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import CustomNetworkBlockSummary from "@/components/view/block/block-summary/CustomNetworkBlockSummary";
import StandardNetworkBlockSummary from "@/components/view/block/block-summary/StandardNetworkBlockSummary";

interface BlockSummaryContainerProps {
  blockHeight: number;
}

const BlockSummaryContainer = ({ blockHeight }: BlockSummaryContainerProps) => {
  const { isCustomNetwork } = useNetworkProvider();

  return (
    <>
      {isCustomNetwork ? (
        <CustomNetworkBlockSummary blockHeight={blockHeight} />
      ) : (
        <StandardNetworkBlockSummary blockHeight={blockHeight} />
      )}
    </>
  );
};

export default BlockSummaryContainer;
