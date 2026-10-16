import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { NftCollectionListSortOption } from "@/common/types/token";

import StandardNetworkNftCollectionsData from "@/components/view/nft-collections/nft-collection-data/StandardNetworkNftCollectionsData";

// NFT collections come from the API, which custom networks do not have.
const NftCollectionListContainer = () => {
  const { isCustomNetwork } = useNetworkProvider();

  const [sortOption, setSortOption] = React.useState<NftCollectionListSortOption>({
    field: "holders",
    order: "desc",
  });

  return isCustomNetwork ? null : (
    <StandardNetworkNftCollectionsData sortOption={sortOption} setSortOption={setSortOption} />
  );
};

export default NftCollectionListContainer;
