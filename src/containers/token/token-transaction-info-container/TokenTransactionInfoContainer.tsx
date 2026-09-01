import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import TokenTransactionInfo from "@/components/view/token/token-transaction-info/TokenTranasctionInfo";

interface TokenTransactionInfoContainerProps {
  tokenId: string;
}

const TokenTransactionInfoContainer = ({ tokenId }: TokenTransactionInfoContainerProps) => {
  const { isCustomNetwork } = useNetworkProvider();
  const [currentTab, setCurrentTab] = React.useState("Transactions");

  React.useEffect(() => {
    if (isCustomNetwork && currentTab !== "Transactions") {
      setCurrentTab("Transactions");
    }
  }, [isCustomNetwork, currentTab]);

  return (
    <TokenTransactionInfo
      tokenPath={tokenId}
      isCustomNetwork={isCustomNetwork}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
    />
  );
};

export default TokenTransactionInfoContainer;
