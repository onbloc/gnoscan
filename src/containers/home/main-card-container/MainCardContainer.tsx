import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";

import MainCard from "@/components/view/main-card/main-card";

const MainCardContainer = () => {
  const { breakpoint } = useWindowSize();

  return <MainCard breakpoint={breakpoint} />;
};

export default MainCardContainer;
