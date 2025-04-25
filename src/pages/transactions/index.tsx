import React from "react";

import useLoading from "@/common/hooks/use-loading";

import TransactionsLayout from "@/layouts/transactions/TransactionsLayout";
const TransactionListContainer = React.lazy(
  () => import("@/containers/transactions/transaction-list-container/TransactionListContainer"),
);
const TransactionSearchContainer = React.lazy(
  () => import("@/containers/transactions/transaction-search-container/TransactionSearchContainer"),
);

export default function Page() {
  const { loading } = useLoading();

  React.useEffect(() => {
    window?.dispatchEvent(new Event("resize"));
  }, [loading]);

  return (
    <>
      <TransactionsLayout
        transactionList={<TransactionListContainer />}
        transactionSearch={<TransactionSearchContainer />}
      />
    </>
  );
}
