import React from "react";
import { useRouter } from "next/router";

import NotFound from "@/components/view/search/not-found/NotFound";

const NotFoundContainer = () => {
  const { asPath } = useRouter();
  // The 404 page is prerendered with asPath "/404", so show the real path only after hydration.
  const [keyword, setKeyword] = React.useState("");

  React.useEffect(() => {
    setKeyword(asPath);
  }, [asPath]);

  return <NotFound keyword={keyword} />;
};

export default NotFoundContainer;
