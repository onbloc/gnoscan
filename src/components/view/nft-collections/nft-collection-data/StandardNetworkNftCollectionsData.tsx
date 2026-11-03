import React from "react";

import { NftCollectionListSortOption } from "@/common/types/token";
import { toNftCollectionListApiSortParams } from "@/common/utils/sort/nft-collection-list-sort";
import { useListPagination } from "@/common/hooks/common/use-list-pagination";
import { useGetNftCollections } from "@/common/react-query/token/api";
import { DEFAULT_LIST_ITEMS_SIZE } from "@/common/values/query.constant";

import { ListPagination } from "@/components/view/common/list-pagination/ListPagination";
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
  const [page, setPage] = useListPagination("nfts", `${sortOption.field}:${sortOption.order}:${keyword ?? ""}`);
  const apiParams = React.useMemo(
    () => ({ ...toNftCollectionListApiSortParams(sortOption), limit: DEFAULT_LIST_ITEMS_SIZE, keyword, page }),
    [sortOption.field, sortOption.order, keyword, page],
  );

  const { data, isFetched, isLoading, isPreviousData } = useGetNftCollections(apiParams, { keepPreviousData: true });

  return (
    <StandardNetworkNftCollectionListTable
      data={data?.items ?? []}
      // Rows of the previous sort stay on screen until the new sort loads.
      isFetched={isFetched || isPreviousData}
      isLoading={isLoading}
      sortOption={sortOption}
      setSortOption={setSortOption}
      footer={
        <ListPagination
          page={page}
          pageSize={DEFAULT_LIST_ITEMS_SIZE}
          totalCount={data?.page.totalCount}
          hasNext={data?.page.hasNext}
          isSettled={!isPreviousData}
          onChangePage={setPage}
        />
      }
    />
  );
};

export default StandardNetworkNftCollectionsData;
