import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import CustomNetworkTokenSummary from "@/components/view/token/token-summary/CustomNetworkTokenSummary";
import StandardNetworkTokenSummary from "@/components/view/token/token-summary/StandardNetworkTokenSummary";

interface TokenSummaryContainerProps {
  tokenId: string;
}

const TokenSummaryContainer = ({ tokenId }: TokenSummaryContainerProps) => {
  const { isDesktop } = useWindowSize();
  const { isCustomNetwork } = useNetworkProvider();

  return isCustomNetwork ? (
    <CustomNetworkTokenSummary tokenPath={tokenId} isDesktop={isDesktop} />
  ) : (
    <StandardNetworkTokenSummary tokenId={tokenId} isDesktop={isDesktop} />
  );
};

export default TokenSummaryContainer;
