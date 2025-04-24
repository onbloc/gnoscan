import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";

import MainRealm from "@/components/view/main-realm/main-realm";

const MainRealmContainer = () => {
  const { breakpoint } = useWindowSize();

  return <MainRealm breakpoint={breakpoint} />;
};

export default MainRealmContainer;
