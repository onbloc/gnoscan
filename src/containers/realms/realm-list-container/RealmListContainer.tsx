import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { RealmListSortOption } from "@/common/types/realm";

import CustomNetworkRealmsData from "@/components/view/realms/realm-data/CustomNetworkRealmsData";
import StandardNetworkRealmsData from "@/components/view/realms/realm-data/StandardNetworkRealmsData";

const RealmListContainer = () => {
  const { isCustomNetwork } = useNetworkProvider();

  const [sortOption, setSortOption] = React.useState<RealmListSortOption>({
    field: "totalCalls",
    order: "desc",
  });

  return isCustomNetwork ? (
    <CustomNetworkRealmsData sortOption={sortOption} setSortOption={setSortOption} />
  ) : (
    <StandardNetworkRealmsData sortOption={sortOption} setSortOption={setSortOption} />
  );
};

export default RealmListContainer;
