import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import TokenTransactionInfo from "@/components/view/token/token-transaction-info/TokenTranasctionInfo";

interface TokenTransactionInfoContainerProps {
  tokenId: string;
}

const TokenTransactionInfoContainer = ({ tokenId }: TokenTransactionInfoContainerProps) => {
  const { isCustomNetwork } = useNetworkProvider();

  return <TokenTransactionInfo tokenPath={tokenId} isCustomNetwork={isCustomNetwork} />;
};

export default TokenTransactionInfoContainer;
