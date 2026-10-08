import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import CustomNetworkTokenSummary from "@/components/view/token/token-summary/CustomNetworkTokenSummary";
import StandardNetworkTokenSummary from "@/components/view/token/token-summary/StandardNetworkTokenSummary";

interface TokenSummaryContainerProps {
  tokenId: string;
}

const TokenSummaryContainer = ({ tokenId }: TokenSummaryContainerProps) => {
  const { isCustomNetwork } = useNetworkProvider();

  return isCustomNetwork ? (
    <CustomNetworkTokenSummary tokenPath={tokenId} />
  ) : (
    <StandardNetworkTokenSummary tokenId={tokenId} />
  );
};

export default TokenSummaryContainer;
