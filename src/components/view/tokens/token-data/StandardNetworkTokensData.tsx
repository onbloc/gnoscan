import React from "react";

import { DEVICE_TYPE } from "@/common/values/ui.constant";

import { StandardNetworkTokenListTable } from "../token-list-table/standard-network-token-list-table/StandardNetworkTokenListTable";
import { useMappedApiTokens } from "@/common/services/token/use-mapped-api-tokens";

interface StandardNetworkTokensDataProps {
  breakpoint: DEVICE_TYPE;
}

const StandardNetworkTokensData = ({ breakpoint }: StandardNetworkTokensDataProps) => {
  const tokensData = useMappedApiTokens();

  return <StandardNetworkTokenListTable breakpoint={breakpoint} {...tokensData} />;
};

export default StandardNetworkTokensData;
