import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useWindowSize } from "@/common/hooks/use-window-size";

import CustomNetworkBlockSummary from "@/components/view/block/block-summary/CustomNetworkBlockSummary";
import StandardNetworkBlockSummary from "@/components/view/block/block-summary/StandardNetworkBlockSummary";

interface BlockSummaryContainerProps {
  blockHeight: number;
}

const BlockSummaryContainer = ({ blockHeight }: BlockSummaryContainerProps) => {
  const { isDesktop } = useWindowSize();
  const { isCustomNetwork } = useNetworkProvider();

  return (
    <>
      {isCustomNetwork ? (
        <CustomNetworkBlockSummary isDesktop={isDesktop} blockHeight={blockHeight} />
      ) : (
        <StandardNetworkBlockSummary isDesktop={isDesktop} blockHeight={blockHeight} />
      )}
    </>
  );
};

export default BlockSummaryContainer;
