import React from "react";

import BlocksLayout from "@/layouts/blocks/BlocksLayout";
import StandardNetworkBlocksContainer from "@/containers/blocks/standard-network-blocks-container/StandardNetworkBlocksContainer";
import CustomNetworkBlocksContainer from "@/containers/blocks/custom-network-blocks-container/CustomNetworkBlocksContainer";

export default function Page() {
  return (
    <BlocksLayout
      standardNetworkBlocks={<StandardNetworkBlocksContainer />}
      customNetworkBlocks={<CustomNetworkBlocksContainer />}
    />
  );
}
