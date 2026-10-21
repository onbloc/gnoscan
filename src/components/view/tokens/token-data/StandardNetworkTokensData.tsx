import React from "react";

import { TokenListSortOption } from "@/common/types/token";
import { isClientSortField, sortTokensOnClient, toTokenListApiSortParams } from "@/common/utils/sort/token-list-sort";
import { useTokenPrice } from "@/common/hooks/common/use-token-price";
import { useFetchRemainingPages } from "@/common/hooks/common/use-fetch-remaining-pages";

import { StandardNetworkTokenListTable } from "../token-list-table/standard-network-token-list-table/StandardNetworkTokenListTable";
import { useMappedApiTokens } from "@/common/services/token/use-mapped-api-tokens";

interface StandardNetworkTokensDataProps {
  sortOption: TokenListSortOption;
  setSortOption: (sortOption: TokenListSortOption) => void;
  keyword?: string;
}

const StandardNetworkTokensData = ({ sortOption, setSortOption, keyword }: StandardNetworkTokensDataProps) => {
  const apiParams = React.useMemo(() => ({ ...toTokenListApiSortParams(sortOption), keyword }), [sortOption, keyword]);

  const tokensData = useMappedApiTokens(apiParams);
  const { getPriceEntry } = useTokenPrice();
  const isClientSort = isClientSortField(sortOption);
  // A client side sort only orders loaded rows, so load every page first.
  useFetchRemainingPages(tokensData, isClientSort);

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
      hasNextPage={!isClientSort && tokensData.hasNextPage}
    />
  );
};

export default StandardNetworkTokensData;
