import React from "react";

import { useTransactions } from "@/common/hooks/transactions/use-transactions";
import { DEVICE_TYPE } from "@/common/values/ui.constant";

import { TransactionListTable } from "../transaction-list-table/TransactionListTable";

interface StandardNetworkTransactionDataProps {
  breakpoint: DEVICE_TYPE;
}

const StandardNetworkTransactionData = ({ breakpoint }: StandardNetworkTransactionDataProps) => {
  const transactionData = useTransactions({});

  return <TransactionListTable breakpoint={breakpoint} {...transactionData} />;
};

export default StandardNetworkTransactionData;
