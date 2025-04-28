import React from "react";

import { useRealm } from "@/common/hooks/realms/use-realm";

import RealmInfo from "@/components/view/realm/realm-info/RealmInfo";

interface RealmInfoContainerProps {
  path: string;
}

const RealmInfoContainer = ({ path }: RealmInfoContainerProps) => {
  const [currentTab, setCurrentTab] = React.useState("Transactions");

  const { transactionEvents, isFetched } = useRealm(path);

  return (
    <RealmInfo
      path={path}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      transactionEvents={transactionEvents}
      isFetched={isFetched}
    />
  );
};

export default RealmInfoContainer;
