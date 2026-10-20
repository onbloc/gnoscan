import { useHistoryEntryState } from "@/common/hooks/detail-tabs/use-history-entry-state";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { RealmListSortOption } from "@/common/types/realm";

import CustomNetworkRealmsData from "@/components/view/realms/realm-data/CustomNetworkRealmsData";
import StandardNetworkRealmsData from "@/components/view/realms/realm-data/StandardNetworkRealmsData";

const DEFAULT_SORT_OPTION: RealmListSortOption = { field: "totalCalls", order: "desc" };

const RealmListContainer = () => {
  const { isCustomNetwork } = useNetworkProvider();

  const [sortOption, setSortOption] = useHistoryEntryState<RealmListSortOption>("realms:sort", DEFAULT_SORT_OPTION);

  return isCustomNetwork ? (
    <CustomNetworkRealmsData sortOption={sortOption} setSortOption={setSortOption} />
  ) : (
    <StandardNetworkRealmsData sortOption={sortOption} setSortOption={setSortOption} />
  );
};

export default RealmListContainer;
