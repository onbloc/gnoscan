import React from "react";

import { useNetwork } from "@/common/hooks/use-network";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useTransaction } from "@/common/hooks/transactions/use-transaction";

import CustomNetworkTransactionSummary from "@/components/view/transaction/transaction-summary/custom-network-transaction-summary/CustomNetworkTransactionSummary";
import StandardNetworkTransactionSummary from "@/components/view/transaction/transaction-summary/standard-network-transaction-summary/StandardNetworkTransactionSummary";

interface TransactionSummaryContainerProps {
  txHash: string;
}

const TransactionSummaryContainer = ({ txHash }: TransactionSummaryContainerProps) => {
  const { getUrlWithNetwork } = useNetwork();
  const { isCustomNetwork } = useNetworkProvider();

  const { transaction, isFetched: isFetchedTxRpcData } = useTransaction(txHash);
  const { txResult, transactionItem } = transaction;

  const blockResultLog = React.useMemo(() => {
    if (transactionItem?.success) return null;

    try {
      return JSON.stringify(txResult, null, 2);
    } catch {
      return null;
    }
  }, [transactionItem, txResult]);

  const txErrorType: string = React.useMemo(() => {
    if (transactionItem?.success) return "";

    return txResult?.ResponseBase?.Error?.["@type"] || "";
  }, [transactionItem?.success, txResult]);

  return isCustomNetwork ? (
    <CustomNetworkTransactionSummary
      txHash={txHash}
      transactionSummaryInfo={transaction}
      txErrorType={txErrorType}
      isFetchedTxRpcData={isFetchedTxRpcData}
      getUrlWithNetwork={getUrlWithNetwork}
    />
  ) : (
    <StandardNetworkTransactionSummary
      txHash={txHash}
      blockResultLog={blockResultLog}
      txErrorType={txErrorType}
      getUrlWithNetwork={getUrlWithNetwork}
    />
  );
};

export default TransactionSummaryContainer;
