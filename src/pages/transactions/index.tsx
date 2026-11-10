import React from "react";

import { ListCsv } from "@/common/hooks/common/use-publish-list-csv";
import { useFunctionFilterState } from "@/common/hooks/common/use-function-filtered-paged-list";
import useLoading from "@/common/hooks/use-loading";

import TransactionsLayout from "@/layouts/transactions/TransactionsLayout";
import TransactionListContainer from "@/containers/transactions/transaction-list-container/TransactionListContainer";
import TransactionSearchContainer from "@/containers/transactions/transaction-search-container/TransactionSearchContainer";
import { FunctionFilter } from "@/components/view/common/function-filter/FunctionFilter";
import { ListCsvButton } from "@/components/view/common/list-csv/ListCsvButton";

export default function Page() {
  const { loading } = useLoading();
  // Function filter of the list, kept per history entry and network.
  const [filter, setFilter] = useFunctionFilterState("transactions");
  // The list reports the page on screen, and the button of the title line downloads it.
  const [csv, setCsv] = React.useState<ListCsv | null>(null);

  React.useEffect(() => {
    window?.dispatchEvent(new Event("resize"));
  }, [loading]);

  return (
    <>
      <TransactionsLayout
        transactionList={<TransactionListContainer filter={filter} onCsvChange={setCsv} />}
        transactionActions={
          <>
            <ListCsvButton csv={csv} />
            <FunctionFilter filter={filter} onChange={setFilter} />
          </>
        }
        transactionSearch={<TransactionSearchContainer />}
      />
    </>
  );
}
