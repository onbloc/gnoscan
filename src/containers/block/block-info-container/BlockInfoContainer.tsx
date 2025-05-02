import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import CustomNetworkBlockInfo from "@/components/view/block/block-info/CustomNetworkBlockInfo";
import StandardNetworkBlockInfo from "@/components/view/block/block-info/StandardNetworkBlockInfo";

interface BlockInfoContainerProps {
  blockHeight: number;
}

const BlockInfoContainer = ({ blockHeight }: BlockInfoContainerProps) => {
  const [currentTab, setCurrentTab] = React.useState("Transactions");
  const { isCustomNetwork } = useNetworkProvider();

  return isCustomNetwork ? (
    <CustomNetworkBlockInfo blockHeight={blockHeight} currentTab={currentTab} setCurrentTab={setCurrentTab} />
  ) : (
    <StandardNetworkBlockInfo blockHeight={blockHeight} currentTab={currentTab} setCurrentTab={setCurrentTab} />
  );
};

export default BlockInfoContainer;
