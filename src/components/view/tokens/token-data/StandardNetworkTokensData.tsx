import React from "react";

import { TokenListSortOption } from "@/common/types/token";
import { isClientSortField, sortTokensOnClient, toTokenListApiSortParams } from "@/common/utils/sort/token-list-sort";
import { useFetchRemainingPages } from "@/common/hooks/common/use-fetch-remaining-pages";
import { PRICES_REFETCH_INTERVAL } from "@/common/values/query.constant";

import { StandardNetworkTokenListTable } from "../token-list-table/standard-network-token-list-table/StandardNetworkTokenListTable";
import { useMappedApiTokens } from "@/common/services/token/use-mapped-api-tokens";

interface StandardNetworkTokensDataProps {
  sortOption: TokenListSortOption;
  setSortOption: (sortOption: TokenListSortOption) => void;
  keyword?: string;
}

// Prices come with the token rows, so the list refreshes at the old /prices cadence.
const PRICE_REFRESH_OPTIONS = { refetchInterval: PRICES_REFETCH_INTERVAL };

const StandardNetworkTokensData = ({ sortOption, setSortOption, keyword }: StandardNetworkTokensDataProps) => {
  const apiParams = React.useMemo(() => ({ ...toTokenListApiSortParams(sortOption), keyword }), [sortOption, keyword]);

  const tokensData = useMappedApiTokens(apiParams, PRICE_REFRESH_OPTIONS);
  const isClientSort = isClientSortField(sortOption);
  // A client side sort only orders loaded rows, so load every page first.
  useFetchRemainingPages(tokensData, isClientSort);

  const data = React.useMemo(() => sortTokensOnClient(tokensData.data, sortOption), [tokensData.data, sortOption]);

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
