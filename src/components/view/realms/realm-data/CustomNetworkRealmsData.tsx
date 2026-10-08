import React from "react";

import { useRealms } from "@/common/hooks/realms/use-realms";
import { useUsername } from "@/common/hooks/account/use-username";
import { RealmListSortOption } from "@/common/types/realm";

import { CustomNetworkRealmListTable } from "../realm-list-table/custom-network-realm-list-table/CustomNetworkRealmListTable";

interface CustomNetworkRealmsDataProps {
  sortOption: RealmListSortOption;
  setSortOption: (sortOption: RealmListSortOption) => void;
}

const CustomNetworkRealmsData = ({ sortOption, setSortOption }: CustomNetworkRealmsDataProps) => {
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
