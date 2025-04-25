import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useWindowSize } from "@/common/hooks/use-window-size";

import StandardNetworkTransactionData from "@/components/view/transactions/transaction-data/StandardNetworkTransactionData";
import CustomNetworkTransactionData from "@/components/view/transactions/transaction-data/CustomNetworkTransactionData";

const TransactionListContainer = () => {
  const { breakpoint } = useWindowSize();
  const { isCustomNetwork } = useNetworkProvider();

  return isCustomNetwork ? (
    <CustomNetworkTransactionData breakpoint={breakpoint} />
  ) : (
    <StandardNetworkTransactionData breakpoint={breakpoint} />
  );
};

export default TransactionListContainer;
