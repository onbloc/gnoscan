import React from "react";

import useLoading from "@/common/hooks/use-loading";

import TransactionsLayout from "@/layouts/transactions/TransactionsLayout";
import TransactionListContainer from "@/containers/transactions/transaction-list-container/TransactionListContainer";
import TransactionSearchContainer from "@/containers/transactions/transaction-search-container/TransactionSearchContainer";
import { ALL_FUNCTIONS, TransactionFunctionFilterValue } from "@/repositories/api/transaction/request";
import { TransactionFunctionFilter } from "@/components/view/transactions/transaction-function-filter/TransactionFunctionFilter";

export default function Page() {
  const { loading } = useLoading();
  // Function filter of the list; the button sits on the title line, the list reads it.
  const [filter, setFilter] = React.useState<TransactionFunctionFilterValue>(ALL_FUNCTIONS);

  React.useEffect(() => {
    window?.dispatchEvent(new Event("resize"));
  }, [loading]);

  return (
    <>
      <TransactionsLayout
        transactionList={<TransactionListContainer filter={filter} onChangeFilter={setFilter} />}
        transactionFilter={<TransactionFunctionFilter filter={filter} onChange={setFilter} />}
        transactionSearch={<TransactionSearchContainer />}
      />
    </>
  );
}
