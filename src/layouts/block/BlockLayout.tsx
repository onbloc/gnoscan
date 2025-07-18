import React from "react";

import { useBlock } from "@/common/hooks/blocks/use-block";
import { useWindowSize } from "@/common/hooks/use-window-size";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import TitleOption from "@/components/view/common/title-option/TitleOption";

import * as S from "./BlockLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";
import NotFound from "@/components/view/search/not-found/NotFound";

interface BlockLayoutProps {
  blockHeight: number;
  blockSummary: React.ReactNode;
  blockInfo: React.ReactNode;
}

const BlockLayout = ({ blockHeight, blockSummary, blockInfo }: BlockLayoutProps) => {
  const { breakpoint, isDesktop } = useWindowSize();
  const { isCustomNetwork } = useNetworkProvider();

  const { block, isFetched: isFetchedRpcData, isErrorBlock: isErrorRpcData } = useBlock(blockHeight);

  if (isCustomNetwork && isFetchedRpcData && isErrorRpcData)
    return (
      <S.InnerLayout>
        <NotFound keyword={`${blockHeight}`} breakpoint={breakpoint} />
      </S.InnerLayout>
    );

  return (
    <S.Container breakpoint={breakpoint}>
      <S.InnerLayout>
        <S.Wrapper breakpoint={breakpoint}>
          <S.TitleWrapper isDesktop={isDesktop}>
            <PageTitle type={isDesktop ? "h2" : "p2"} title={`Block #${blockHeight}`} />
            <TitleOption
              prevProps={{
                disabled: !block?.hasPreviousBlock,
                path: `/block/${Number(block.blockHeight) - 1}`,
              }}
              nextProps={{
                disabled: !block?.hasNextBlock,
                path: `/block/${Number(block.blockHeight) + 1}`,
              }}
            />
          </S.TitleWrapper>
          {blockSummary}
          {blockInfo}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default BlockLayout;
