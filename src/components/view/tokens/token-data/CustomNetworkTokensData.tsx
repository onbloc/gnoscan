import React from "react";

import { useTokens } from "@/common/hooks/tokens/use-tokens";

import { CustomNetworkTokenListTable } from "../token-list-table/custom-network-token-list-table/CustomNetworkTokenListTable";

const CustomNetworkTokensData = () => {
  const tokensData = useTokens();

  return <CustomNetworkTokenListTable {...tokensData} />;
};

export default CustomNetworkTokensData;
