import { useHistoryEntryState } from "@/common/hooks/detail-tabs/use-history-entry-state";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { NftCollectionListSortOption } from "@/common/types/token";

import StandardNetworkNftCollectionsData from "@/components/view/nft-collections/nft-collection-data/StandardNetworkNftCollectionsData";

const DEFAULT_SORT_OPTION: NftCollectionListSortOption = { field: "holders", order: "desc" };

/** NFT collections come from the API, which custom networks do not have. */
const NftCollectionListContainer = () => {
  const { currentNetwork, isCustomNetwork } = useNetworkProvider();

  const [sortOption, setSortOption] = useHistoryEntryState<NftCollectionListSortOption>(
    "nfts:sort",
    DEFAULT_SORT_OPTION,
  );

  return isCustomNetwork ? null : (
    // Keyed by network so rows kept across a sort change never show on another network.
    <StandardNetworkNftCollectionsData
      key={currentNetwork?.chainId}
      sortOption={sortOption}
      setSortOption={setSortOption}
    />
  );
};

export default NftCollectionListContainer;
