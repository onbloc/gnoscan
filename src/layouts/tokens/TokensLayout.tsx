import React from "react";

import * as S from "./TokensLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";

interface TokensLayoutProps {
  tokenList: React.ReactNode;
}

const TokensLayout = ({ tokenList }: TokensLayoutProps) => {
  return (
    <S.Container>
      <S.InnerLayout>
        <S.Wrapper>
          <PageTitle title="Tokens" type="h2" />
          {tokenList}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default TokensLayout;
