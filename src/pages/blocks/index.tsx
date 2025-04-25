import React from "react";

import BlocksLayout from "@/layouts/blocks/BlocksLayout";
const BlockListContainer = React.lazy(() => import("@/containers/blocks/block-list-container/BlockListContainer"));

export default function Page() {
  return <BlocksLayout blockList={<BlockListContainer />} />;
}
