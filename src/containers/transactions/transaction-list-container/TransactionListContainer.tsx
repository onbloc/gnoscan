import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { TransactionFunctionFilter } from "@/repositories/api/transaction/request";

import StandardNetworkTransactionData from "@/components/view/transactions/transaction-data/StandardNetworkTransactionData";
import CustomNetworkTransactionData from "@/components/view/transactions/transaction-data/CustomNetworkTransactionData";
import { TransactionFunctionSearch } from "@/components/view/transactions/transaction-function-search/TransactionFunctionSearch";

const TransactionListContainer = () => {
  const { isCustomNetwork } = useNetworkProvider();
  const [filter, setFilter] = React.useState<TransactionFunctionFilter>();

  return isCustomNetwork ? (
    <CustomNetworkTransactionData />
  ) : (
    <>
      <TransactionFunctionSearch onApply={setFilter} />
      <StandardNetworkTransactionData filter={filter} />
    </>
  );
};

export default TransactionListContainer;
