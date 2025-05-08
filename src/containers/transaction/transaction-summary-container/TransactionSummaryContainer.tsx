import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";

import { useNetwork } from "@/common/hooks/use-network";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import CustomNetworkTransactionSummary from "@/components/view/transaction/transaction-summary/custom-network-transaction-summary/CustomNetworkTransactionSummary";
import StandardNetworkTransactionSummary from "@/components/view/transaction/transaction-summary/standard-network-transaction-summary/StandardNetworkTransactionSummary";

interface TransactionSummaryContainerProps {
  txHash: string;
}

const TransactionSummaryContainer = ({ txHash }: TransactionSummaryContainerProps) => {
  const { isDesktop } = useWindowSize();
  const { getUrlWithNetwork } = useNetwork();
  const { isCustomNetwork } = useNetworkProvider();

  return isCustomNetwork ? (
    <CustomNetworkTransactionSummary txHash={txHash} isDesktop={isDesktop} getUrlWithNetwork={getUrlWithNetwork} />
  ) : (
    <StandardNetworkTransactionSummary txHash={txHash} isDesktop={isDesktop} getUrlWithNetwork={getUrlWithNetwork} />
  );
};

export default TransactionSummaryContainer;
