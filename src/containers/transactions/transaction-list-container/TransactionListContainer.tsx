import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import { TransactionDatatable } from "@/components/view/datatable";
import { TransactionApiDatatable } from "@/components/view/datatable/transaction/transaction-api";

const TransactionListContainer = () => {
  const { isCustomNetwork } = useNetworkProvider();

  return isCustomNetwork ? <TransactionDatatable /> : <TransactionApiDatatable />;
};

export default TransactionListContainer;
