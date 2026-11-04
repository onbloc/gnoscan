import React from "react";

import { TokenListSortOption } from "@/common/types/token";
import {
  applyLivePrices,
  isClientSortField,
  sortTokensOnClient,
  toTokenListApiSortParams,
} from "@/common/utils/sort/token-list-sort";
import { useFetchRemainingPages } from "@/common/hooks/common/use-fetch-remaining-pages";
import { useTokenPrice } from "@/common/hooks/common/use-token-price";

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

  // Prices are polled through /prices; the token rows are not refetched for them.
  const data = React.useMemo(
    () => sortTokensOnClient(applyLivePrices(tokensData.data, getPriceEntry), sortOption),
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
