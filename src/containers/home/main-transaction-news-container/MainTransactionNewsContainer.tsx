import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";

import MainTransactionNews from "@/components/view/main-transaction-news/main-transaction-news";

const MainTransactionNewsContainer = () => {
  const { breakpoint } = useWindowSize();

  return <MainTransactionNews breakpoint={breakpoint} />;
};

export default MainTransactionNewsContainer;
