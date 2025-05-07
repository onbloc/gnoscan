import React from "react";
import { GetServerSideProps } from "next";

import BlockLayout from "@/layouts/block/BlockLayout";
import BlockSummaryContainer from "@/containers/block/block-summary-container/BlockSummaryContainer";
import BlockInfoContainer from "@/containers/block/block-info-container/BlockInfoContainer";
import { isValidBlockHeight } from "@/common/utils/string-util";

interface PageProps {
  blockHeight: number;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async context => {
  const { height } = context.query;
  const isValid = isValidBlockHeight(height);

  if (!isValid) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      blockHeight: Number(height),
    },
  };
};

export default function Page({ blockHeight }: PageProps) {
  return (
    <>
      <BlockLayout
        blockHeight={blockHeight}
        blockSummary={<BlockSummaryContainer blockHeight={blockHeight} />}
        blockInfo={<BlockInfoContainer blockHeight={blockHeight} />}
      />
    </>
  );
}
