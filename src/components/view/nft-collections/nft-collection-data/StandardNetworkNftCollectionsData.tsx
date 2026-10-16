import React from "react";

import { NftCollectionListSortOption } from "@/common/types/token";
import { toNftCollectionListApiSortParams } from "@/common/utils/sort/nft-collection-list-sort";
import { useGetNftCollectionsInfinite } from "@/common/react-query/token/api";
import { DEFAULT_LIST_ITEMS_SIZE } from "@/common/values/query.constant";

import { StandardNetworkNftCollectionListTable } from "../nft-collection-list-table/StandardNetworkNftCollectionListTable";

interface StandardNetworkNftCollectionsDataProps {
  sortOption: NftCollectionListSortOption;
  setSortOption: (sortOption: NftCollectionListSortOption) => void;
}

const StandardNetworkNftCollectionsData = ({ sortOption, setSortOption }: StandardNetworkNftCollectionsDataProps) => {
  const apiParams = React.useMemo(
    () => ({ ...toNftCollectionListApiSortParams(sortOption), limit: DEFAULT_LIST_ITEMS_SIZE }),
    [sortOption.field, sortOption.order],
  );

  const { data, isFetched, isLoading, fetchNextPage, hasNextPage } = useGetNftCollectionsInfinite(apiParams);

  const collections = React.useMemo(() => data?.pages.flatMap(page => page.items) ?? [], [data]);

  return (
    <StandardNetworkNftCollectionListTable
      data={collections}
      hasNextPage={hasNextPage}
      isFetched={isFetched}
      isLoading={isLoading}
      fetchNextPage={fetchNextPage}
      sortOption={sortOption}
      setSortOption={setSortOption}
    />
  );
};

export default StandardNetworkNftCollectionsData;
