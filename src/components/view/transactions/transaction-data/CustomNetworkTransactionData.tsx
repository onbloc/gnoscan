import React from "react";

import { useAllTransactions } from "@/common/hooks/transactions/use-all-transactions";
import { DEVICE_TYPE } from "@/common/values/ui.constant";

import { TransactionListTable } from "../transaction-list-table/TransactionListTable";

interface CustomNetworkTransactionDataProps {
  breakpoint: DEVICE_TYPE;
}

const CustomNetworkTransactionData = ({ breakpoint }: CustomNetworkTransactionDataProps) => {
  const transactionData = useAllTransactions({});

  return <TransactionListTable breakpoint={breakpoint} {...transactionData} />;
};

export default CustomNetworkTransactionData;
