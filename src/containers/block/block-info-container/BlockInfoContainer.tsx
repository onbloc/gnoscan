import React from "react";

import { useBlock } from "@/common/hooks/blocks/use-block";

import BlockInfo from "@/components/view/block/block-info/BlockInfo";

interface BlockInfoContainerProps {
  blockHeight: number;
}

const BlockInfoContainer = ({ blockHeight }: BlockInfoContainerProps) => {
  const [currentTab, setCurrentTab] = React.useState("Transactions");

  const { events, isFetched } = useBlock(blockHeight);

  return (
    <BlockInfo
      blockHeight={blockHeight}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      events={events}
      isFetched={isFetched}
    />
  );
};

export default BlockInfoContainer;
