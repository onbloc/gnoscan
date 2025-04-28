import React from "react";

import { useBlock } from "@/common/hooks/blocks/use-block";
import { useNetwork } from "@/common/hooks/use-network";

import BlockSummary from "@/components/view/block/block-summary/BlockSummary";
import { useGetValidatorNames } from "@/common/hooks/common/use-get-validator-names";
import { useWindowSize } from "@/common/hooks/use-window-size";

interface BlockSummaryContainerProps {
  blockHeight: number;
}

const BlockSummaryContainer = ({ blockHeight }: BlockSummaryContainerProps) => {
  const { isDesktop } = useWindowSize();
  const { block, isFetched } = useBlock(blockHeight);
  const { getUrlWithNetwork } = useNetwork();
  const { validatorInfos } = useGetValidatorNames();

  return (
    <>
      <BlockSummary
        block={block}
        isDesktop={isDesktop}
        isFetched={isFetched}
        validatorInfos={validatorInfos}
        getUrlWithNetwork={getUrlWithNetwork}
      />
    </>
  );
};

export default BlockSummaryContainer;
