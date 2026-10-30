import { useHistoryEntryState } from "@/common/hooks/detail-tabs/use-history-entry-state";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { RealmListSortOption } from "@/common/types/realm";

import CustomNetworkRealmsData from "@/components/view/realms/realm-data/CustomNetworkRealmsData";
import StandardNetworkRealmsData from "@/components/view/realms/realm-data/StandardNetworkRealmsData";
import { ListSearch, useListKeyword } from "@/components/view/list-summary/ListSearch";

const DEFAULT_SORT_OPTION: RealmListSortOption = { field: "totalCalls", order: "desc" };

const RealmListContainer = () => {
  const { currentNetwork, isCustomNetwork } = useNetworkProvider();

  const [sortOption, setSortOption] = useHistoryEntryState<RealmListSortOption>("realms:sort", DEFAULT_SORT_OPTION);
  const search = useListKeyword();

  return isCustomNetwork ? (
    <CustomNetworkRealmsData sortOption={sortOption} setSortOption={setSortOption} />
  ) : (
    <>
      <ListSearch value={search.value} onChange={search.setValue} placeholder="Search by realm name or path" />
      {/* Keyed by network so rows kept across a sort change never show on another network. */}
      <StandardNetworkRealmsData
        key={currentNetwork?.chainId}
        sortOption={sortOption}
        setSortOption={setSortOption}
        keyword={search.keyword}
      />
    </>
  );
};

export default RealmListContainer;
