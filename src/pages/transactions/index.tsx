import React from "react";

import { useFunctionFilterState } from "@/common/hooks/common/use-function-filtered-paged-list";
import useLoading from "@/common/hooks/use-loading";

import TransactionsLayout from "@/layouts/transactions/TransactionsLayout";
import TransactionListContainer from "@/containers/transactions/transaction-list-container/TransactionListContainer";
import TransactionSearchContainer from "@/containers/transactions/transaction-search-container/TransactionSearchContainer";
import { FunctionFilter } from "@/components/view/common/function-filter/FunctionFilter";

export default function Page() {
  const { loading } = useLoading();
  // Function filter of the list, kept per history entry and network.
  const [filter, setFilter] = useFunctionFilterState("transactions");

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
