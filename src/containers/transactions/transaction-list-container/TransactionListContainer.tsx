import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import StandardNetworkTransactionData from "@/components/view/transactions/transaction-data/StandardNetworkTransactionData";
import CustomNetworkTransactionData from "@/components/view/transactions/transaction-data/CustomNetworkTransactionData";
import { TransactionFunctionFilterValue } from "@/repositories/api/transaction/request";

interface TransactionListContainerProps {
  filter: TransactionFunctionFilterValue;
}

const TransactionListContainer = ({ filter }: TransactionListContainerProps) => {
  const { isCustomNetwork } = useNetworkProvider();

  return isCustomNetwork ? <CustomNetworkTransactionData /> : <StandardNetworkTransactionData filter={filter} />;
};

export default TransactionListContainer;
