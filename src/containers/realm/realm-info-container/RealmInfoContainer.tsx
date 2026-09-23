import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useDetailTabScroll } from "@/common/hooks/detail-tabs/use-detail-tab-scroll";

import CustomNetworkRealmInfo from "@/components/view/realm/realm-info/CustomNetworkRealmInfo";
import StandardNetworkRealmInfo from "@/components/view/realm/realm-info/StandardNetworkRealmInfo";

interface RealmInfoContainerProps {
  path: string;
}

const RealmInfoContainer = ({ path }: RealmInfoContainerProps) => {
  const { isCustomNetwork } = useNetworkProvider();

  const [currentTab, setCurrentTab] = useDetailTabScroll<string>(path, "Transactions");

  return isCustomNetwork ? (
    <CustomNetworkRealmInfo path={path} currentTab={currentTab} setCurrentTab={setCurrentTab} />
  ) : (
    <StandardNetworkRealmInfo path={path} currentTab={currentTab} setCurrentTab={setCurrentTab} />
  );
};

export default RealmInfoContainer;
