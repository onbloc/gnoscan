import React from "react";

import useLoading from "@/common/hooks/use-loading";

import TransactionsLayout from "@/layouts/transactions/TransactionsLayout";
import TransactionListContainer from "@/containers/transactions/transaction-list-container/TransactionListContainer";
import TransactionSearchContainer from "@/containers/transactions/transaction-search-container/TransactionSearchContainer";
import { FunctionFilterValue } from "@/common/types/function-filter";
import { ALL_FUNCTIONS } from "@/common/values/function-filter.constant";
import { FunctionFilter } from "@/components/view/common/function-filter/FunctionFilter";

export default function Page() {
  const { loading } = useLoading();
  // Function filter of the list; the button sits on the title line, the list reads it.
  const [filter, setFilter] = React.useState<FunctionFilterValue>(ALL_FUNCTIONS);

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
