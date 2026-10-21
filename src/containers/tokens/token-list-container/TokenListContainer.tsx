import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { TokenListSortOption } from "@/common/types/token";

import CustomNetworkTokensData from "@/components/view/tokens/token-data/CustomNetworkTokensData";
import StandardNetworkTokensData from "@/components/view/tokens/token-data/StandardNetworkTokensData";

const TokenListContainer = () => {
  const { isCustomNetwork } = useNetworkProvider();

  const [sortOption, setSortOption] = React.useState<TokenListSortOption>({
    field: "holders",
    order: "desc",
  });

  return isCustomNetwork ? (
    <CustomNetworkTokensData />
  ) : (
    <StandardNetworkTokensData sortOption={sortOption} setSortOption={setSortOption} />
  );
};

export default TokenListContainer;
