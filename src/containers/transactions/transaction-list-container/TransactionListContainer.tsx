import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import StandardNetworkTransactionData from "@/components/view/transactions/transaction-data/StandardNetworkTransactionData";
import CustomNetworkTransactionData from "@/components/view/transactions/transaction-data/CustomNetworkTransactionData";

const TransactionListContainer = () => {
  const { isCustomNetwork } = useNetworkProvider();

  return isCustomNetwork ? <CustomNetworkTransactionData /> : <StandardNetworkTransactionData />;
};

export default TransactionListContainer;
