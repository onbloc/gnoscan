import React from "react";
import { useRouter } from "next/router";

import NotFound from "@/components/view/search/not-found/NotFound";

// Nothing changes after hydration, so there is no external store to subscribe to.
const noop = () => undefined;
const subscribe = () => noop;

const NotFoundContainer = () => {
  const { asPath } = useRouter();
  // The 404 page is prerendered with asPath "/404", so show the real path only after hydration.
  const hydrated = React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return <NotFound keyword={hydrated ? asPath : ""} />;
};

export default NotFoundContainer;
