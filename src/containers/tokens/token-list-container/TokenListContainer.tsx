import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import CustomNetworkTokensData from "@/components/view/tokens/token-data/CustomNetworkTokensData";
import StandardNetworkTokensData from "@/components/view/tokens/token-data/StandardNetworkTokensData";

const TokenListContainer = () => {
  const { breakpoint } = useWindowSize();
  const { isCustomNetwork } = useNetworkProvider();

  return isCustomNetwork ? (
    <CustomNetworkTokensData breakpoint={breakpoint} />
  ) : (
    <StandardNetworkTokensData breakpoint={breakpoint} />
  );
};

export default TokenListContainer;
