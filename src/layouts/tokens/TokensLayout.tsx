import React from "react";

import * as S from "./TokensLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";
import TokenResourceLink from "@/components/ui/token-resource-link/TokenResourceLink";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { TokensSummary } from "@/components/view/list-summary/TokensSummary";

interface TokensLayoutProps {
  tokenList: React.ReactNode;
}

const TokensLayout = ({ tokenList }: TokensLayoutProps) => {
  // Summaries come from the API, which custom networks do not have.
  const { isCustomNetwork } = useNetworkProvider();

  return (
    <S.Container>
      <S.InnerLayout>
        <S.Wrapper>
          <S.TitleWrap>
            <PageTitle
              title="Tokens"
              type="h2"
              description="GRC20 tokens on Gno.land — what's new, what's moving, and who's holding."
            />
            <TokenResourceLink label="Gno.land Token Resources" />
          </S.TitleWrap>
          {!isCustomNetwork && <TokensSummary />}
          {tokenList}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default TokensLayout;
