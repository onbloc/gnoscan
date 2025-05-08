import React from "react";

import TokensLayout from "@/layouts/tokens/TokensLayout";
import TokenListContainer from "@/containers/tokens/token-list-container/TokenListContainer";

export default function Page() {
  return (
    <>
      <TokensLayout tokenList={<TokenListContainer />} />
    </>
  );
}
