import React from "react";

import { useRealm } from "@/common/hooks/realms/use-realm";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import CustomNetworkRealmInfo from "@/components/view/realm/realm-info/CustomNetworkRealmInfo";
import StandardNetworkRealmInfo from "@/components/view/realm/realm-info/StandardNetworkRealmInfo";

interface RealmInfoContainerProps {
  path: string;
}

const RealmInfoContainer = ({ path }: RealmInfoContainerProps) => {
  const { isCustomNetwork } = useNetworkProvider();

  const [currentTab, setCurrentTab] = React.useState("Transactions");

  const { transactionEvents, isFetched } = useRealm(path);

  return isCustomNetwork ? (
    <CustomNetworkRealmInfo path={path} currentTab={currentTab} setCurrentTab={setCurrentTab} />
  ) : (
    <StandardNetworkRealmInfo
      path={path}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      transactionEvents={transactionEvents}
    />
  );
};

export default RealmInfoContainer;
