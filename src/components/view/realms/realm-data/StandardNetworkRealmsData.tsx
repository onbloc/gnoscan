import React from "react";

import { toRealmListApiSortParams } from "@/common/utils/sort/realm-list-sort";
import { RealmListSortOption } from "@/common/types/realm";

import { StandardNetworkRealmListTable } from "../realm-list-table/standard-network-realm-list-table/StandardNetworkRealmListTable";
import { useMappedApiRealms } from "@/common/services/realm/use-mapped-api-realms";

interface StandardNetworkRealmsDataProps {
  sortOption: RealmListSortOption;
  setSortOption: (sortOption: RealmListSortOption) => void;
}

const StandardNetworkRealmsData = ({ sortOption, setSortOption }: StandardNetworkRealmsDataProps) => {
  // Sorting is applied server-side over the full realm set; the sort option is
  // forwarded as API params so pagination follows the server order.
  const apiParams = React.useMemo(() => toRealmListApiSortParams(sortOption), [sortOption.field, sortOption.order]);

  const { data, isFetched, hasNextPage, fetchNextPage } = useMappedApiRealms(apiParams);

  return (
    <StandardNetworkRealmListTable
      sortOption={sortOption}
      setSortOption={setSortOption}
      realms={data}
      isFetched={isFetched}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
};
export default React.memo(StandardNetworkRealmsData);
