import React from "react";

import HomeLayout from "@/layouts/home/HomeLayout";
const MainCardContainer = React.lazy(() => import("@/containers/home/main-card-container/MainCardContainer"));
const MainActiveListContainer = React.lazy(
  () => import("@/containers/home/main-active-list-container/MainActiveListContainer"),
);
const MainRealmContainer = React.lazy(() => import("@/containers/home/main-realm-container/MainRealmContainer"));
const MainTransactionNewsContainer = React.lazy(
  () => import("@/containers/home/main-transaction-news-container/MainTransactionNewsContainer"),
);

export default function Page() {
  return (
    <>
      <HomeLayout
        mainCard={<MainCardContainer />}
        mainActiveList={<MainActiveListContainer />}
        mainRealm={<MainRealmContainer />}
        mainTransactionNews={<MainTransactionNewsContainer />}
      />
    </>
  );
}
