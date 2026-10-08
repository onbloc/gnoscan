import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";

import * as S from "./TokenLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";

interface TokenLayoutProps {
  tokenSummary: React.ReactNode;
  tokenTransactionInfo: React.ReactNode;
}

const TokenLayout = ({ tokenSummary, tokenTransactionInfo }: TokenLayoutProps) => {
  const { isDesktop } = useWindowSize();

  return (
    <S.Container>
      <S.InnerLayout>
        <S.Wrapper>
          <PageTitle title="Token Details" type={isDesktop ? "h2" : "p2"} />
          {tokenSummary}
          {tokenTransactionInfo}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default TokenLayout;
