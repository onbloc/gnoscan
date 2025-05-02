import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { RealmListSortOption } from "@/common/types/realm";

import CustomNetworkRealmsData from "@/components/view/realms/realm-data/CustomNetworkRealmsData";
import StandardNetworkRealmsData from "@/components/view/realms/realm-data/StandardNetworkRealmsData";

const RealmListContainer = () => {
  const { breakpoint } = useWindowSize();
  const { isCustomNetwork } = useNetworkProvider();

  const [sortOption, setSortOption] = React.useState<RealmListSortOption>({
    field: "none",
    order: "none",
  });

  return isCustomNetwork ? (
    <CustomNetworkRealmsData breakpoint={breakpoint} sortOption={sortOption} setSortOption={setSortOption} />
  ) : (
    <StandardNetworkRealmsData breakpoint={breakpoint} sortOption={sortOption} setSortOption={setSortOption} />
  );
};

export default RealmListContainer;
