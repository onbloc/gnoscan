import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useWindowSize } from "@/common/hooks/use-window-size";
import { useNetwork } from "@/common/hooks/use-network";
import { useTokenMeta } from "@/common/hooks/common/use-token-meta";

import CustomNetworkTransactionInfo from "@/components/view/transaction/transaction-info/custom-network-transaction-info/CustomNetworkTransactionInfo";
import StandardNetworkTransactionInfo from "@/components/view/transaction/transaction-info/standard-network-transaction-info/StandardNetworkTransactionInfo";

interface TransactionInfoContainerProps {
  txHash: string;
}

const TransactionInfoContainer = ({ txHash }: TransactionInfoContainerProps) => {
  const { isDesktop } = useWindowSize();
  const { isCustomNetwork } = useNetworkProvider();

  const [currentTab, setCurrentTab] = React.useState("Contract");

  const { getUrlWithNetwork } = useNetwork();
  const { getTokenAmount } = useTokenMeta();

  return isCustomNetwork ? (
    <CustomNetworkTransactionInfo
      txHash={txHash}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      isDesktop={isDesktop}
      getUrlWithNetwork={getUrlWithNetwork}
      getTokenAmount={getTokenAmount}
    />
  ) : (
    <StandardNetworkTransactionInfo
      txHash={txHash}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      isDesktop={isDesktop}
      getUrlWithNetwork={getUrlWithNetwork}
      getTokenAmount={getTokenAmount}
    />
  );
};

export default TransactionInfoContainer;
