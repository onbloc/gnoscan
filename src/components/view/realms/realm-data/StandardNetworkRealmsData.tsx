import React from "react";

import { useListPagination } from "@/common/hooks/common/use-list-pagination";
import { DEFAULT_LIST_ITEMS_SIZE } from "@/common/values/query.constant";
import { toRealmListApiSortParams } from "@/common/utils/sort/realm-list-sort";
import { RealmListSortOption } from "@/common/types/realm";

import { ListPagination } from "@/components/view/common/list-pagination/ListPagination";
import { StandardNetworkRealmListTable } from "../realm-list-table/standard-network-realm-list-table/StandardNetworkRealmListTable";
import { useMappedApiRealms } from "@/common/services/realm/use-mapped-api-realms";

interface StandardNetworkRealmsDataProps {
  sortOption: RealmListSortOption;
  setSortOption: (sortOption: RealmListSortOption) => void;
  keyword?: string;
}

const StandardNetworkRealmsData = ({ sortOption, setSortOption, keyword }: StandardNetworkRealmsDataProps) => {
  // Sorting is applied server-side over the full realm set; the sort option is
  // forwarded as API params so pagination follows the server order.
  const scope = `${sortOption.field}:${sortOption.order}:${keyword ?? ""}`;
  const [page, setPage] = useListPagination("realms", scope);
  const apiParams = React.useMemo(
    () => ({ ...toRealmListApiSortParams(sortOption), keyword, page }),
    [sortOption.field, sortOption.order, keyword, page],
  );

  const { data, isFetched, isPreviousData, hasNext, totalCount } = useMappedApiRealms(apiParams);

  return (
    <StandardNetworkRealmListTable
      sortOption={sortOption}
      setSortOption={setSortOption}
      realms={data}
      isFetched={isFetched}
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
export default React.memo(StandardNetworkRealmsData);
