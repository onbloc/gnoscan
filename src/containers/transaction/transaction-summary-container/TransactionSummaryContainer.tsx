import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";

import TransactionSummary from "@/components/view/transaction/transaction-summary/TransactionSummary";
import { useTransaction } from "@/common/hooks/transactions/use-transaction";
import { useNetwork } from "@/common/hooks/use-network";

interface TransactionSummaryContainerProps {
  txHash: string;
}

const TransactionSummaryContainer = ({ txHash }: TransactionSummaryContainerProps) => {
  const { isDesktop } = useWindowSize();
  const { getUrlWithNetwork } = useNetwork();

  const transactionData = useTransaction(txHash);
  return (
    <TransactionSummary
      isDesktop={isDesktop}
      getUrlWithNetwork={getUrlWithNetwork}
      txHash={txHash}
      {...transactionData}
    />
  );
};

export default TransactionSummaryContainer;
