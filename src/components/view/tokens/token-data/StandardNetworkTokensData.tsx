import React from "react";

import { TokenListSortOption } from "@/common/types/token";
import { isClientSortField, sortTokensOnClient, toTokenListApiSortParams } from "@/common/utils/sort/token-list-sort";
import { useTokenPrice } from "@/common/hooks/common/use-token-price";

import { StandardNetworkTokenListTable } from "../token-list-table/standard-network-token-list-table/StandardNetworkTokenListTable";
import { useMappedApiTokens } from "@/common/services/token/use-mapped-api-tokens";

interface StandardNetworkTokensDataProps {
  sortOption: TokenListSortOption;
  setSortOption: (sortOption: TokenListSortOption) => void;
}

const StandardNetworkTokensData = ({ sortOption, setSortOption }: StandardNetworkTokensDataProps) => {
  const apiParams = React.useMemo(() => toTokenListApiSortParams(sortOption), [sortOption]);

  const tokensData = useMappedApiTokens(apiParams);
  const { getPriceEntry } = useTokenPrice();
  const isClientSort = isClientSortField(sortOption);
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = tokensData;

  // A client side sort only orders loaded rows, so load every page first. Re-runs as each page finishes loading.
  React.useEffect(() => {
    if (isClientSort && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [isClientSort, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const data = React.useMemo(
    () => sortTokensOnClient(tokensData.data, sortOption, getPriceEntry),
    [tokensData.data, sortOption, getPriceEntry],
  );

  return (
    <StandardNetworkTokenListTable
      sortOption={sortOption}
      setSortOption={setSortOption}
      {...tokensData}
      data={data}
      hasNextPage={!isClientSort && hasNextPage}
    />
  );
};

export default StandardNetworkTokensData;
