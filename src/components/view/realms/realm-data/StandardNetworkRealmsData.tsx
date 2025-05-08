import React from "react";

import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { sortRealmList } from "@/common/utils/sort/realm-list-sort";
import { RealmListSortOption } from "@/common/types/realm";

import { StandardNetworkRealmListTable } from "../realm-list-table/standard-network-realm-list-table/StandardNetworkRealmListTable";
import { useMappedApiRealms } from "@/common/services/realm/use-mapped-api-realms";

interface StandardNetworkRealmsDataProps {
  breakpoint: DEVICE_TYPE;
  sortOption: RealmListSortOption;
  setSortOption: (sortOption: RealmListSortOption) => void;
}

const StandardNetworkRealmsData = ({ breakpoint, sortOption, setSortOption }: StandardNetworkRealmsDataProps) => {
  const { data, isFetched, hasNextPage, fetchNextPage } = useMappedApiRealms();

  const realmListData = React.useMemo(() => {
    if (!data) return [];

    return sortRealmList(data, sortOption);
  }, [data, sortOption.field, sortOption.order]);

  return (
    <StandardNetworkRealmListTable
      breakpoint={breakpoint}
      sortOption={sortOption}
      setSortOption={setSortOption}
      realms={realmListData}
      isFetched={isFetched}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
};
export default React.memo(StandardNetworkRealmsData);
