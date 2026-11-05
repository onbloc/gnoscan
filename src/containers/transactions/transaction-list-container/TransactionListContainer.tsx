import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import StandardNetworkTransactionData from "@/components/view/transactions/transaction-data/StandardNetworkTransactionData";
import CustomNetworkTransactionData from "@/components/view/transactions/transaction-data/CustomNetworkTransactionData";
import { TransactionFunctionFilterValue } from "@/repositories/api/transaction/request";
import { TransactionFunctionChips } from "@/components/view/transactions/transaction-function-filter/TransactionFunctionChips";

interface TransactionListContainerProps {
  filter: TransactionFunctionFilterValue;
  onChangeFilter: (filter: TransactionFunctionFilterValue) => void;
}

const TransactionListContainer = ({ filter, onChangeFilter }: TransactionListContainerProps) => {
  const { isCustomNetwork } = useNetworkProvider();

  return isCustomNetwork ? (
    <CustomNetworkTransactionData />
  ) : (
    <>
      <TransactionFunctionChips filter={filter} onChange={onChangeFilter} />
      <StandardNetworkTransactionData filter={filter} />
    </>
  );
};

export default TransactionListContainer;
