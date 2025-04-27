import React from "react";
import { useRouter } from "next/router";

import { useWindowSize } from "@/common/hooks/use-window-size";

import NotFound from "@/components/view/search/not-found/NotFound";

const NotFoundContainer = () => {
  const { asPath } = useRouter();
  const { breakpoint } = useWindowSize();

  return <NotFound keyword={asPath} breakpoint={breakpoint} />;
};

export default NotFoundContainer;
