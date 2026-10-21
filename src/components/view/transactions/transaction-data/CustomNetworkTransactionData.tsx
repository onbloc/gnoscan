import React from "react";

import { useAllTransactions } from "@/common/hooks/transactions/use-all-transactions";

import { CustomNetworkTransactionListTable } from "../transaction-list-table/custom-network/CustomNetworkTransactionListTable";

const CustomNetworkTransactionData = () => {
  const transactionData = useAllTransactions({});

  return <CustomNetworkTransactionListTable {...transactionData} />;
};

export default CustomNetworkTransactionData;
