import { useHistoryEntryState } from "@/common/hooks/detail-tabs/use-history-entry-state";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { NftCollectionListSortOption } from "@/common/types/token";

import StandardNetworkNftCollectionsData from "@/components/view/nft-collections/nft-collection-data/StandardNetworkNftCollectionsData";

const DEFAULT_SORT_OPTION: NftCollectionListSortOption = { field: "holders", order: "desc" };

/** NFT collections come from the API, which custom networks do not have. */
const NftCollectionListContainer = () => {
  const { isCustomNetwork } = useNetworkProvider();

  const [sortOption, setSortOption] = useHistoryEntryState<NftCollectionListSortOption>(
    "nfts:sort",
    DEFAULT_SORT_OPTION,
  );

  return isCustomNetwork ? null : (
    <StandardNetworkNftCollectionsData sortOption={sortOption} setSortOption={setSortOption} />
  );
};

export default NftCollectionListContainer;
