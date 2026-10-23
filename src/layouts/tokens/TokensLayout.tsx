import React from "react";

import * as S from "./TokensLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";
import TokenResourceLink from "@/components/ui/token-resource-link/TokenResourceLink";

interface TokensLayoutProps {
  tokenList: React.ReactNode;
}

const TokensLayout = ({ tokenList }: TokensLayoutProps) => {
  return (
    <S.Container>
      <S.InnerLayout>
        <S.Wrapper>
          <S.TitleWrap>
            <PageTitle title="Tokens" type="h2" />
            <TokenResourceLink label="Gno.land Token Resources" />
          </S.TitleWrap>
          {tokenList}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default TokensLayout;
