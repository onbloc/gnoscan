import React from "react";

import { TokenListSortOption } from "@/common/types/token";
import { toTokenListApiSortParams } from "@/common/utils/sort/token-list-sort";

import { StandardNetworkTokenListTable } from "../token-list-table/standard-network-token-list-table/StandardNetworkTokenListTable";
import { useMappedApiTokens } from "@/common/services/token/use-mapped-api-tokens";

interface StandardNetworkTokensDataProps {
  sortOption: TokenListSortOption;
  setSortOption: (sortOption: TokenListSortOption) => void;
}

const StandardNetworkTokensData = ({ sortOption, setSortOption }: StandardNetworkTokensDataProps) => {
  const apiParams = React.useMemo(() => toTokenListApiSortParams(sortOption), [sortOption.field, sortOption.order]);

  const tokensData = useMappedApiTokens(apiParams);

  return <StandardNetworkTokenListTable sortOption={sortOption} setSortOption={setSortOption} {...tokensData} />;
};

export default StandardNetworkTokensData;
