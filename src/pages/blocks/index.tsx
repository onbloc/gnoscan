import React from "react";

import { ListCsv } from "@/common/hooks/common/use-publish-list-csv";
import BlocksLayout from "@/layouts/blocks/BlocksLayout";
import { ListCsvButton } from "@/components/view/common/list-csv/ListCsvButton";
import StandardNetworkBlocksContainer from "@/containers/blocks/standard-network-blocks-container/StandardNetworkBlocksContainer";
import CustomNetworkBlocksContainer from "@/containers/blocks/custom-network-blocks-container/CustomNetworkBlocksContainer";

export default function Page() {
  // The list reports the page on screen, and the button of the title line downloads it.
  const [csv, setCsv] = React.useState<ListCsv | null>(null);

  return (
    <BlocksLayout
      standardNetworkBlocks={<StandardNetworkBlocksContainer onCsvChange={setCsv} />}
      customNetworkBlocks={<CustomNetworkBlocksContainer />}
      blockActions={<ListCsvButton csv={csv} />}
    />
  );
}
