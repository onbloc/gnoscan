import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import TokenTransactionInfo from "@/components/view/token/token-transaction-info/TokenTranasctionInfo";

interface TokenTransactionInfoContainerProps {
  tokenPath: string;
}

const TokenTransactionInfoContainer = ({ tokenPath }: TokenTransactionInfoContainerProps) => {
  const { isCustomNetwork } = useNetworkProvider();

  return <TokenTransactionInfo tokenPath={tokenPath} isCustomNetwork={isCustomNetwork} />;
};

export default TokenTransactionInfoContainer;
