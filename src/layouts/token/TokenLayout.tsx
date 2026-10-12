import React from "react";

import * as S from "./TokenLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";

interface TokenLayoutProps {
  title?: string;
  tokenSummary: React.ReactNode;
  tokenTransactionInfo: React.ReactNode;
}

const TokenLayout = ({ title = "Token Details", tokenSummary, tokenTransactionInfo }: TokenLayoutProps) => {
  return (
    <S.Container>
      <S.InnerLayout>
        <S.Wrapper>
          <PageTitle title={title} type="p2" desktopType="h2" />
          {tokenSummary}
          {tokenTransactionInfo}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default TokenLayout;
