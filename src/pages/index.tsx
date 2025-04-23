import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";

import HomeLayout from "@/layouts/home/HomeLayout";
const MainCard = React.lazy(() => import("@/components/view/main-card/main-card"));
const MainRealm = React.lazy(() => import("@/components/view/main-realm/main-realm"));
const MainTransactionNews = React.lazy(() => import("@/components/view/main-transaction-news/main-transaction-news"));
const MainActiveList = React.lazy(() => import("@/components/view/main-active-list"));

const Home = () => {
  const { breakpoint } = useWindowSize();

  return (
    <>
      <HomeLayout
        breakpoint={breakpoint}
        mainCard={<MainCard breakpoint={breakpoint} />}
        mainActiveList={<MainActiveList breakpoint={breakpoint} />}
        mainRealm={<MainRealm breakpoint={breakpoint} />}
        mainTransactionNews={<MainTransactionNews breakpoint={breakpoint} />}
      />
    </>
  );
};

export default Home;
