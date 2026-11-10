import React from "react";

import { ListCsv } from "@/common/hooks/common/use-publish-list-csv";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import StandardNetworkTransactionData from "@/components/view/transactions/transaction-data/StandardNetworkTransactionData";
import CustomNetworkTransactionData from "@/components/view/transactions/transaction-data/CustomNetworkTransactionData";
import { FunctionFilterValue } from "@/common/types/function-filter";

interface TransactionListContainerProps {
  filter: FunctionFilterValue;
  // Receives the page on screen as CSV; a custom network has none.
  onCsvChange?: (csv: ListCsv | null) => void;
}

const TransactionListContainer = ({ filter, onCsvChange }: TransactionListContainerProps) => {
  const { isCustomNetwork } = useNetworkProvider();

  return isCustomNetwork ? (
    <CustomNetworkTransactionData />
  ) : (
    <StandardNetworkTransactionData filter={filter} onCsvChange={onCsvChange} />
  );
};

export default TransactionListContainer;
