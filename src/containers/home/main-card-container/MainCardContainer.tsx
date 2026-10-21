import React from "react";

import MainCard from "@/components/view/main-card/main-card";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

const MainCardContainer = () => {
  const { isCustomNetwork } = useNetworkProvider();

  return <MainCard isCustomNetwork={isCustomNetwork} />;
};

export default MainCardContainer;
