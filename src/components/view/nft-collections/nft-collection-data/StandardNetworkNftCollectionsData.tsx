import React from "react";

import { NftCollectionListSortOption } from "@/common/types/token";
import { toNftCollectionListApiSortParams } from "@/common/utils/sort/nft-collection-list-sort";
import { useGetNftCollectionsInfinite } from "@/common/react-query/token/api";
import { DEFAULT_LIST_ITEMS_SIZE } from "@/common/values/query.constant";

import { StandardNetworkNftCollectionListTable } from "../nft-collection-list-table/StandardNetworkNftCollectionListTable";

interface StandardNetworkNftCollectionsDataProps {
  sortOption: NftCollectionListSortOption;
  setSortOption: (sortOption: NftCollectionListSortOption) => void;
  keyword?: string;
}

const StandardNetworkNftCollectionsData = ({
  sortOption,
  setSortOption,
  keyword,
}: StandardNetworkNftCollectionsDataProps) => {
  const apiParams = React.useMemo(
    () => ({ ...toNftCollectionListApiSortParams(sortOption), limit: DEFAULT_LIST_ITEMS_SIZE, keyword }),
    [sortOption.field, sortOption.order, keyword],
  );

  const { data, isFetched, isLoading, isPreviousData, fetchNextPage, hasNextPage } = useGetNftCollectionsInfinite(
    apiParams,
    {
      keepPreviousData: true,
    },
  );

  const collections = React.useMemo(() => data?.pages.flatMap(page => page.items) ?? [], [data]);

  return (
    <StandardNetworkNftCollectionListTable
      data={collections}
      // The next cursor of the previous sort does not apply to the new one.
      hasNextPage={hasNextPage && !isPreviousData}
      // Rows of the previous sort stay on screen until the new sort loads.
      isFetched={isFetched || isPreviousData}
      isLoading={isLoading}
      fetchNextPage={fetchNextPage}
      sortOption={sortOption}
      setSortOption={setSortOption}
    />
  );
};

export default StandardNetworkNftCollectionsData;
