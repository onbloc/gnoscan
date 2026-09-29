import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useHistoryEntryState } from "@/common/hooks/detail-tabs/use-history-entry-state";
import { useTabScrollMemory } from "@/common/hooks/detail-tabs/use-tab-scroll-memory";
import { ACTIVITY_TAB } from "@/common/values/activity-tab.constant";

import TokenTransactionInfo from "@/components/view/token/token-transaction-info/TokenTranasctionInfo";

interface TokenTransactionInfoContainerProps {
  tokenId: string;
}

const TokenTransactionInfoContainer = ({ tokenId }: TokenTransactionInfoContainerProps) => {
  const { isCustomNetwork } = useNetworkProvider();
  const [currentTab, setCurrentTab] = useHistoryEntryState<string>(`token:${tokenId}:tab`, ACTIVITY_TAB.TRANSACTIONS);
  const switchTab = useTabScrollMemory(`token:${tokenId}`, currentTab, setCurrentTab);

  React.useEffect(() => {
    if (isCustomNetwork && currentTab !== ACTIVITY_TAB.TRANSACTIONS) {
      setCurrentTab(ACTIVITY_TAB.TRANSACTIONS);
    }
  }, [isCustomNetwork, currentTab, setCurrentTab]);

  return (
    <TokenTransactionInfo
      tokenPath={tokenId}
      isCustomNetwork={isCustomNetwork}
      currentTab={currentTab}
      setCurrentTab={switchTab}
    />
  );
};

export default TokenTransactionInfoContainer;
