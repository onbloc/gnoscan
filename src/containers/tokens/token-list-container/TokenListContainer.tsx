import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";
import { useTokens } from "@/common/hooks/tokens/use-tokens";

import { TokenListTable } from "@/components/view/tokens/token-list-table/TokenListTable";

const TokenListContainer = () => {
  const { breakpoint } = useWindowSize();

  const tokensData = useTokens();

  return <TokenListTable breakpoint={breakpoint} {...tokensData} />;
};

export default TokenListContainer;
