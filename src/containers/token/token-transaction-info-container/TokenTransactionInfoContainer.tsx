import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useDetailTabScroll } from "@/common/hooks/detail-tabs/use-detail-tab-scroll";

import TokenTransactionInfo from "@/components/view/token/token-transaction-info/TokenTranasctionInfo";

interface TokenTransactionInfoContainerProps {
  tokenId: string;
}

const TokenTransactionInfoContainer = ({ tokenId }: TokenTransactionInfoContainerProps) => {
  const { isCustomNetwork } = useNetworkProvider();
  const [currentTab, setCurrentTab] = useDetailTabScroll<string>(tokenId, "Transactions");

  React.useEffect(() => {
    if (isCustomNetwork && currentTab !== "Transactions") {
      setCurrentTab("Transactions");
    }
  }, [isCustomNetwork, currentTab, setCurrentTab]);

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
