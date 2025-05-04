import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";

import MainCard from "@/components/view/main-card/main-card";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

const MainCardContainer = () => {
  const { breakpoint } = useWindowSize();
  const { isCustomNetwork } = useNetworkProvider();

  return <MainCard breakpoint={breakpoint} isCustomNetwork={isCustomNetwork} />;
};

export default MainCardContainer;
