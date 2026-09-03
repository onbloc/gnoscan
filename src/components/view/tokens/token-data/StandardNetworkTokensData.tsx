import React from "react";

import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { TokenListSortOption } from "@/common/types/token";
import { toTokenListApiSortParams } from "@/common/utils/sort/token-list-sort";

import { StandardNetworkTokenListTable } from "../token-list-table/standard-network-token-list-table/StandardNetworkTokenListTable";
import { useMappedApiTokens } from "@/common/services/token/use-mapped-api-tokens";

interface StandardNetworkTokensDataProps {
  breakpoint: DEVICE_TYPE;
  sortOption: TokenListSortOption;
  setSortOption: (sortOption: TokenListSortOption) => void;
}

const StandardNetworkTokensData = ({ breakpoint, sortOption, setSortOption }: StandardNetworkTokensDataProps) => {
  const apiParams = React.useMemo(() => toTokenListApiSortParams(sortOption), [sortOption.field, sortOption.order]);

  const tokensData = useMappedApiTokens(apiParams);

  return (
    <StandardNetworkTokenListTable
      breakpoint={breakpoint}
      sortOption={sortOption}
      setSortOption={setSortOption}
      {...tokensData}
    />
  );
};

export default StandardNetworkTokensData;
