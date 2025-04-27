import React from "react";

import TokensLayout from "@/layouts/tokens/TokensLayout";
const TokenListContainer = React.lazy(() => import("@/containers/tokens/token-list-container/TokenListContainer"));

export default function Page() {
  return (
    <>
      <TokensLayout tokenList={<TokenListContainer />} />
    </>
  );
}
