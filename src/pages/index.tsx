import React from "react";

import HomeLayout from "@/layouts/home/HomeLayout";
import MainCardContainer from "@/containers/home/main-card-container/MainCardContainer";
import MainActiveListContainer from "@/containers/home/main-active-list-container/MainActiveListContainer";
import MainRealmContainer from "@/containers/home/main-realm-container/MainRealmContainer";
import MainTransactionNewsContainer from "@/containers/home/main-transaction-news-container/MainTransactionNewsContainer";

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
