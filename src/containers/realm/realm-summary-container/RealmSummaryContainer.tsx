import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import CustomNetworkRealmSummary from "@/components/view/realm/realm-summary/CustomNetworkRealmSummary";
import StandardNetworkRealmSummary from "@/components/view/realm/realm-summary/StandardNetworkRealmSummary";

interface RealmSummaryContainerProps {
  path: string;
}

const RealmSummaryContainer = ({ path }: RealmSummaryContainerProps) => {
  const { isDesktop } = useWindowSize();
  const { isCustomNetwork } = useNetworkProvider();

  return isCustomNetwork ? (
    <CustomNetworkRealmSummary path={path} isDesktop={isDesktop} />
  ) : (
    <StandardNetworkRealmSummary path={path} isDesktop={isDesktop} />
  );
};

export default RealmSummaryContainer;
