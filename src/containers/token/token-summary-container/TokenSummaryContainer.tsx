import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";
import { useToken } from "@/common/hooks/tokens/use-token";
import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { useNetwork } from "@/common/hooks/use-network";
import { useUsername } from "@/common/hooks/account/use-username";

import TokenSummary from "@/components/view/token/token-summary/TokenSummary";

interface TokenSummaryContainerProps {
  tokenPath: string;
}

const TokenSummaryContainer = ({ tokenPath }: TokenSummaryContainerProps) => {
  const { isDesktop } = useWindowSize();

  const { summary, files, isFetched: isFetchedToken } = useToken(tokenPath);
  const { isFetchedGRC20Tokens, getTokenAmount } = useTokenMeta();
  const { getUrlWithNetwork } = useNetwork();
  const { isFetched: isFetchedUsername, getName } = useUsername();

  return (
    <TokenSummary
      isDesktop={isDesktop}
      isFetchedGRC20Tokens={isFetchedGRC20Tokens}
      isFetched={isFetchedToken && isFetchedUsername && isFetchedGRC20Tokens}
      summaryData={summary}
      files={files}
      getTokenAmount={getTokenAmount}
      getUrlWithNetwork={getUrlWithNetwork}
      getName={getName}
    />
  );
};

export default TokenSummaryContainer;
