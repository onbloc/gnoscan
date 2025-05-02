import React from "react";

import BlocksLayout from "@/layouts/blocks/BlocksLayout";
const StandardNetworkBlocksContainer = React.lazy(
  () => import("@/containers/blocks/standard-network-blocks-container/StandardNetworkBlocksContainer"),
);
const CustomNetworkBlocksContainer = React.lazy(
  () => import("@/containers/blocks/custom-network-blocks-container/CustomNetworkBlocksContainer"),
);

export default function Page() {
  return (
    <BlocksLayout
      standardNetworkBlocks={<StandardNetworkBlocksContainer />}
      customNetworkBlocks={<CustomNetworkBlocksContainer />}
    />
  );
}
