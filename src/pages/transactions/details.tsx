import React from "react";

import { useRouter } from "@/common/hooks/common/use-router";
import { parseTxHash } from "@/common/utils/transaction.utility";

import TransactionLayout from "@/layouts/transaction/TransactionLayout";
const TransactionSummaryContainer = React.lazy(
  () => import("@/containers/transaction/transaction-summary-container/TransactionSummaryContainer"),
);
const TransactionInfoContainer = React.lazy(
  () => import("@/containers/transaction/transaction-info-container/TransactionInfoContainer"),
);

export default function Page() {
  const { asPath, push } = useRouter();
  const hash = parseTxHash(asPath);

  React.useEffect(() => {
    if (hash === "") {
      push("/transactions");
    }
  }, [hash]);

  return (
    <>
      <TransactionLayout
        txHash={hash}
        transactionSummary={<TransactionSummaryContainer txHash={hash} />}
        transactionInfo={<TransactionInfoContainer txHash={hash} />}
      />
    </>
  );
}
