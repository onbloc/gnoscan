import React from "react";
import dynamic from "next/dynamic";

import BlocksLayout from "@/layouts/blocks/BlocksLayout";
const StandardNetworkBlocksContainer = dynamic(
  () => import("@/containers/blocks/standard-network-blocks-container/StandardNetworkBlocksContainer"),
);
const CustomNetworkBlocksContainer = dynamic(
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
