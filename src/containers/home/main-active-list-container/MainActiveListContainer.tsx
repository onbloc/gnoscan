import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";

import MainActiveList from "@/components/view/main-active-list";

const MainActiveListContainer = () => {
  const { breakpoint } = useWindowSize();

  return <MainActiveList breakpoint={breakpoint} />;
};

export default MainActiveListContainer;
