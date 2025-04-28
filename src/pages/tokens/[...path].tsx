import React from "react";

import { useRouter } from "@/common/hooks/common/use-router";

import TokenLayout from "@/layouts/token/TokenLayout";
const TokenSummaryContainer = React.lazy(
  () => import("@/containers/token/token-summary-container/TokenSummaryContainer"),
);
const TokenTransactionInfoContainer = React.lazy(
  () => import("@/containers/token/token-transaction-info-container/TokenTransactionInfoContainer"),
);

export default function Page() {
  const router = useRouter();
  const { path } = router.query;
  const tokenPath = Array.isArray(path) ? path.join("/").split("?")[0] : path?.toString();

  return (
    <>
      <TokenLayout
        tokenPath={tokenPath || ""}
        tokenSummary={<TokenSummaryContainer tokenPath={tokenPath || ""} />}
        tokenTransactionInfo={<TokenTransactionInfoContainer tokenPath={tokenPath || ""} />}
      />
    </>
  );
}
