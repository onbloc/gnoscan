import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import * as S from "./BlocksLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";

interface BlocksLayoutProps {
  standardNetworkBlocks: React.ReactNode;
  customNetworkBlocks: React.ReactNode;
}

const BlocksLayout = ({ standardNetworkBlocks, customNetworkBlocks }: BlocksLayoutProps) => {
  const { isCustomNetwork } = useNetworkProvider();

  return (
    <S.Container>
      <S.InnerLayout>
        <S.Wrapper>
          <PageTitle title="Blocks" type="h2" />
          {isCustomNetwork ? customNetworkBlocks : standardNetworkBlocks}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default BlocksLayout;
