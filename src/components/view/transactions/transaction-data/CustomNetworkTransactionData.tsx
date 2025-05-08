import React from "react";

import { useAllTransactions } from "@/common/hooks/transactions/use-all-transactions";
import { DEVICE_TYPE } from "@/common/values/ui.constant";

import { CustomNetworkTransactionListTable } from "../transaction-list-table/custom-network/CustomNetworkTransactionListTable";

interface CustomNetworkTransactionDataProps {
  breakpoint: DEVICE_TYPE;
}

const CustomNetworkTransactionData = ({ breakpoint }: CustomNetworkTransactionDataProps) => {
  const transactionData = useAllTransactions({});

  return <CustomNetworkTransactionListTable breakpoint={breakpoint} {...transactionData} />;
};

export default CustomNetworkTransactionData;
