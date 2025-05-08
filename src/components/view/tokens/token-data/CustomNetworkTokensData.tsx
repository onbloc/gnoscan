import React from "react";

import { useTokens } from "@/common/hooks/tokens/use-tokens";
import { DEVICE_TYPE } from "@/common/values/ui.constant";

import { CustomNetworkTokenListTable } from "../token-list-table/custom-network-token-list-table/CustomNetworkTokenListTable";

interface CustomNetworkTokensDataProps {
  breakpoint: DEVICE_TYPE;
}

const CustomNetworkTokensData = ({ breakpoint }: CustomNetworkTokensDataProps) => {
  const tokensData = useTokens();

  return <CustomNetworkTokenListTable breakpoint={breakpoint} {...tokensData} />;
};

export default CustomNetworkTokensData;
