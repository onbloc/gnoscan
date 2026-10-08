import React from "react";
import { useRouter } from "next/router";

import NotFound from "@/components/view/search/not-found/NotFound";

const NotFoundContainer = () => {
  const { asPath } = useRouter();

  return <NotFound keyword={asPath} />;
};

export default NotFoundContainer;
