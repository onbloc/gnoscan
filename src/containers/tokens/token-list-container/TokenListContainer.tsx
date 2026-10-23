import { useHistoryEntryState } from "@/common/hooks/detail-tabs/use-history-entry-state";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { TokenListSortOption } from "@/common/types/token";

import CustomNetworkTokensData from "@/components/view/tokens/token-data/CustomNetworkTokensData";
import StandardNetworkTokensData from "@/components/view/tokens/token-data/StandardNetworkTokensData";

const DEFAULT_SORT_OPTION: TokenListSortOption = { field: "holders", order: "desc" };

const TokenListContainer = () => {
  const { currentNetwork, isCustomNetwork } = useNetworkProvider();

  const [sortOption, setSortOption] = useHistoryEntryState<TokenListSortOption>("tokens:sort", DEFAULT_SORT_OPTION);

  return isCustomNetwork ? (
    <CustomNetworkTokensData />
  ) : (
    // Keyed by network so rows kept across a sort change never show on another network.
    <StandardNetworkTokensData key={currentNetwork?.chainId} sortOption={sortOption} setSortOption={setSortOption} />
  );
};

export default TokenListContainer;
