import React from "react";

import { useHistoryEntryState } from "@/common/hooks/detail-tabs/use-history-entry-state";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import useLoading from "@/common/hooks/use-loading";

import TransactionsLayout from "@/layouts/transactions/TransactionsLayout";
import TransactionListContainer from "@/containers/transactions/transaction-list-container/TransactionListContainer";
import TransactionSearchContainer from "@/containers/transactions/transaction-search-container/TransactionSearchContainer";
import { FunctionFilterValue } from "@/common/types/function-filter";
import { ALL_FUNCTIONS } from "@/common/values/function-filter.constant";
import { FunctionFilter } from "@/components/view/common/function-filter/FunctionFilter";

export default function Page() {
  const { loading } = useLoading();
  const { currentNetwork } = useNetworkProvider();
  // Function filter of the list, kept per history entry and network (labels differ per network).
  const [filter, setFilter] = useHistoryEntryState<FunctionFilterValue>(
    `transactions:${currentNetwork?.chainId}:function-filter`,
    ALL_FUNCTIONS,
  );

  React.useEffect(() => {
    window?.dispatchEvent(new Event("resize"));
  }, [loading]);

  return (
    <>
      <TransactionsLayout
        transactionList={<TransactionListContainer filter={filter} />}
        transactionFilter={<FunctionFilter filter={filter} onChange={setFilter} />}
        transactionSearch={<TransactionSearchContainer />}
      />
    </>
  );
}
