import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";

import { useNetwork } from "@/common/hooks/use-network";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useTransaction } from "@/common/hooks/transactions/use-transaction";
import { extractStorageDepositFromTxEvents } from "@/common/utils/transaction.utility";

import CustomNetworkTransactionSummary from "@/components/view/transaction/transaction-summary/custom-network-transaction-summary/CustomNetworkTransactionSummary";
import StandardNetworkTransactionSummary from "@/components/view/transaction/transaction-summary/standard-network-transaction-summary/StandardNetworkTransactionSummary";

interface TransactionSummaryContainerProps {
  txHash: string;
}

const TransactionSummaryContainer = ({ txHash }: TransactionSummaryContainerProps) => {
  const { isDesktop } = useWindowSize();
  const { getUrlWithNetwork } = useNetwork();
  const { isCustomNetwork } = useNetworkProvider();

  const { transaction, isFetched: isFetchedTxRpcData } = useTransaction(txHash);
  const { blockResult, transactionItem } = transaction;

  const blockResultLog = React.useMemo(() => {
    if (transactionItem?.success) return null;

    try {
      return JSON.stringify(blockResult, null, 2);
    } catch {
      return null;
    }
  }, [transactionItem, blockResult]);

  const txErrorType: string = React.useMemo(() => {
    if (transactionItem?.success) return "";

    if (!blockResult || !blockResult?.deliver_tx) return "";

    return blockResult.deliver_tx[0]?.ResponseBase?.Error?.["@type"] || "";
  }, [transactionItem?.success, blockResult]);

  return isCustomNetwork ? (
    <CustomNetworkTransactionSummary
      txHash={txHash}
      transactionSummaryInfo={transaction}
      txErrorType={txErrorType}
      isFetchedTxRpcData={isFetchedTxRpcData}
      isDesktop={isDesktop}
      getUrlWithNetwork={getUrlWithNetwork}
    />
  ) : (
    <StandardNetworkTransactionSummary
      txHash={txHash}
      blockResultLog={blockResultLog}
      txErrorType={txErrorType}
      isDesktop={isDesktop}
      getUrlWithNetwork={getUrlWithNetwork}
    />
  );
};

export default TransactionSummaryContainer;
