import React from "react";

import { useRouter } from "@/common/hooks/common/use-router";

import TokenLayout from "@/layouts/token/TokenLayout";
import TokenSummaryContainer from "@/containers/token/token-summary-container/TokenSummaryContainer";
import TokenTransactionInfoContainer from "@/containers/token/token-transaction-info-container/TokenTransactionInfoContainer";

export default function Page() {
  const router = useRouter();
  const { path } = router.query;
  const tokenId = Array.isArray(path) ? path.join("/").split("?")[0] : path?.toString();

  return (
    <>
      <TokenLayout
        tokenId={tokenId || ""}
        tokenSummary={<TokenSummaryContainer tokenId={tokenId || ""} />}
        tokenTransactionInfo={<TokenTransactionInfoContainer tokenId={tokenId || ""} />}
      />
    </>
  );
}
