import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { isApiNotFound } from "@/common/utils/common.utility";
import { useGetTokenById } from "@/common/react-query/token/api";

import * as S from "./TokenLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";
import NotFound from "@/components/view/search/not-found/NotFound";

interface TokenLayoutProps {
  title?: string;
  tokenId?: string;
  tokenSummary: React.ReactNode;
  tokenTransactionInfo: React.ReactNode;
}

const TokenLayout = ({
  title = "Token Details",
  tokenId = "",
  tokenSummary,
  tokenTransactionInfo,
}: TokenLayoutProps) => {
  const { isCustomNetwork } = useNetworkProvider();
  // Same query as the summary, so this reads the shared cache instead of sending another request.
  const tokenQuery = useGetTokenById(tokenId, { enabled: !isCustomNetwork && !!tokenId });

  if (!isCustomNetwork && isApiNotFound(tokenQuery))
    return (
      <S.InnerLayout>
        <NotFound keyword={tokenId} />
      </S.InnerLayout>
    );

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
