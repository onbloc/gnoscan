import React from "react";

import { useRealms } from "@/common/hooks/realms/use-realms";
import { useUsername } from "@/common/hooks/account/use-username";
import { RealmListSortOption } from "@/common/types/realm";

import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { CustomNetworkRealmListTable } from "../realm-list-table/custom-network-realm-list-table/CustomNetworkRealmListTable";

interface CustomNetworkRealmsDataProps {
  breakpoint: DEVICE_TYPE;
  sortOption: RealmListSortOption;
  setSortOption: (sortOption: RealmListSortOption) => void;
}

const CustomNetworkRealmsData = ({ breakpoint, sortOption, setSortOption }: CustomNetworkRealmsDataProps) => {
  const { isFetched: isFetchedUsername, getName } = useUsername();

  const {
    realms,
    isFetched: isFetchedRealms,
    hasNextPage,
    nextPage: fetchNextPage,
    isDefault,
    defaultFromHeight,
  } = useRealms(true, sortOption);

  return (
    <CustomNetworkRealmListTable
      breakpoint={breakpoint}
      sortOption={sortOption}
      setSortOption={setSortOption}
      realms={realms}
      isFetched={isFetchedUsername && isFetchedRealms}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      isDefault={isDefault}
      defaultFromHeight={defaultFromHeight}
      getName={getName}
    />
  );
};

export default CustomNetworkRealmsData;
