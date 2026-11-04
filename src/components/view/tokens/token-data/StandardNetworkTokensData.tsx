import React from "react";

import { TokenListSortOption } from "@/common/types/token";
import { applyLivePrices, toTokenListApiSortParams } from "@/common/utils/sort/token-list-sort";
import { useListPagination } from "@/common/hooks/common/use-list-pagination";
import { useTokenPrice } from "@/common/hooks/common/use-token-price";
import { DEFAULT_LIST_ITEMS_SIZE } from "@/common/values/query.constant";

import { ListPagination } from "@/components/view/common/list-pagination/ListPagination";
import { StandardNetworkTokenListTable } from "../token-list-table/standard-network-token-list-table/StandardNetworkTokenListTable";
import { useMappedApiTokens } from "@/common/services/token/use-mapped-api-tokens";

interface StandardNetworkTokensDataProps {
  sortOption: TokenListSortOption;
  setSortOption: (sortOption: TokenListSortOption) => void;
  keyword?: string;
}

const StandardNetworkTokensData = ({ sortOption, setSortOption, keyword }: StandardNetworkTokensDataProps) => {
  // Sorting is applied server-side over the full token set, so pagination follows the server order.
  const scope = `${sortOption.field}:${sortOption.order}:${keyword ?? ""}`;
  const [page, setPage] = useListPagination("tokens", scope);
  const apiParams = React.useMemo(
    () => ({ ...toTokenListApiSortParams(sortOption), keyword, page }),
    [sortOption.field, sortOption.order, keyword, page],
  );

  const {
    data: tokens,
    isFetched,
    isError,
    isLoading,
    isPreviousData,
    hasNext,
    totalCount,
  } = useMappedApiTokens(apiParams);
  const { getPriceEntry } = useTokenPrice();

  // Prices are polled through /prices; the token rows are not refetched for them.
  const data = React.useMemo(() => applyLivePrices(tokens, getPriceEntry), [tokens, getPriceEntry]);

  return (
    <StandardNetworkTokenListTable
      sortOption={sortOption}
      setSortOption={setSortOption}
      data={data}
      isFetched={isFetched}
      isLoading={isLoading}
      isError={isError}
      footer={
        <ListPagination
          page={page}
          pageSize={DEFAULT_LIST_ITEMS_SIZE}
          totalCount={totalCount}
          hasNext={hasNext}
          isSettled={!isPreviousData}
          scope={scope}
          onChangePage={setPage}
        />
      }
    />
  );
};

export default StandardNetworkTokensData;
