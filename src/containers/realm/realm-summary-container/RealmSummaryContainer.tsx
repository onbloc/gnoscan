import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import CustomNetworkRealmSummary from "@/components/view/realm/realm-summary/CustomNetworkRealmSummary";
import StandardNetworkRealmSummary from "@/components/view/realm/realm-summary/StandardNetworkRealmSummary";

interface RealmSummaryContainerProps {
  path: string;
}

const RealmSummaryContainer = ({ path }: RealmSummaryContainerProps) => {
  const { isCustomNetwork } = useNetworkProvider();

  return isCustomNetwork ? <CustomNetworkRealmSummary path={path} /> : <StandardNetworkRealmSummary path={path} />;
};

export default RealmSummaryContainer;
