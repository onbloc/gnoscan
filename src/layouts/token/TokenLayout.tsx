import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";
import { useToken } from "@/common/hooks/tokens/use-token";
import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { useUsername } from "@/common/hooks/account/use-username";

import * as S from "./TokenLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";
import NotFound from "@/components/view/search/not-found/NotFound";

interface TokenLayoutProps {
  tokenPath: string;
  tokenSummary: React.ReactNode;
  tokenTransactionInfo: React.ReactNode;
}

const TokenLayout = ({ tokenPath, tokenSummary, tokenTransactionInfo }: TokenLayoutProps) => {
  const { breakpoint, isDesktop } = useWindowSize();

  const { summary, isFetched: isFetchedToken } = useToken(tokenPath);
  const { isFetchedGRC20Tokens } = useTokenMeta();
  const { isFetched: isFetchedUsername } = useUsername();

  const isDataLoaded = isFetchedToken && isFetchedUsername && isFetchedGRC20Tokens;
  const hasError = isDataLoaded && (!summary || summary.packagePath === "");

  if (isDataLoaded && hasError) {
    return <NotFound keyword={tokenPath} breakpoint={breakpoint} />;
  }

  return (
    <S.Container breakpoint={breakpoint}>
      <S.InnerLayout>
        <S.Wrapper breakpoint={breakpoint}>
          <PageTitle title="Token Details" type={isDesktop ? "h2" : "p2"} />
          {tokenSummary}
          {tokenTransactionInfo}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default TokenLayout;
