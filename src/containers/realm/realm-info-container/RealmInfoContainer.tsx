import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useHistoryEntryState } from "@/common/hooks/detail-tabs/use-history-entry-state";
import { ACTIVITY_TAB } from "@/common/values/activity-tab.constant";

import CustomNetworkRealmInfo from "@/components/view/realm/realm-info/CustomNetworkRealmInfo";
import StandardNetworkRealmInfo from "@/components/view/realm/realm-info/StandardNetworkRealmInfo";

// Tabs CustomNetworkRealmInfo can render; any other selection falls back to Transactions.
const CUSTOM_NETWORK_TABS: string[] = [ACTIVITY_TAB.TRANSACTIONS, ACTIVITY_TAB.EVENTS];

interface RealmInfoContainerProps {
  path: string;
}

const RealmInfoContainer = ({ path }: RealmInfoContainerProps) => {
  const { isCustomNetwork } = useNetworkProvider();

  const [currentTab, setCurrentTab] = useHistoryEntryState<string>(`realm:${path}:tab`, ACTIVITY_TAB.TRANSACTIONS);

  React.useEffect(() => {
    if (isCustomNetwork && !CUSTOM_NETWORK_TABS.includes(currentTab)) {
      setCurrentTab(ACTIVITY_TAB.TRANSACTIONS);
    }
  }, [isCustomNetwork, currentTab, setCurrentTab]);

  return isCustomNetwork ? (
    <CustomNetworkRealmInfo path={path} currentTab={currentTab} setCurrentTab={setCurrentTab} />
  ) : (
    <StandardNetworkRealmInfo path={path} currentTab={currentTab} setCurrentTab={setCurrentTab} />
  );
};

export default RealmInfoContainer;
