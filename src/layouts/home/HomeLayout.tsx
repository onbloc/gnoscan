import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { IndexerClient } from "@/common/clients/indexer-client/indexer-client";

import * as S from "./HomeLayout.styles";
import IndexerClientConnectionFailureNotice from "./components/indexer-client-connection-failure-notice/IndexerClientConnectionFailureNotice";

interface HomeLayoutProps {
  breakpoint: DEVICE_TYPE;
  mainCard: React.ReactNode;
  mainActiveList: React.ReactNode;
  mainRealm: React.ReactNode;
  mainTransactionNews: React.ReactNode;
}

const HomeLayout = ({ breakpoint, mainCard, mainActiveList, mainRealm, mainTransactionNews }: HomeLayoutProps) => {
  const { indexerQueryClient } = useNetworkProvider();
  const hasIndexerClient = Boolean(indexerQueryClient);

  return (
    <S.Container breakpoint={breakpoint}>
      <S.Wrapper breakpoint={breakpoint}>
        {mainCard}
        {hasIndexerClient ? (
          <IndexerDependentComponents
            mainActiveList={mainActiveList}
            mainRealm={mainRealm}
            mainTransactionNews={mainTransactionNews}
          />
        ) : (
          <IndexerClientConnectionFailureNotice />
        )}
      </S.Wrapper>
    </S.Container>
  );
};

const IndexerDependentComponents = React.memo(
  ({
    mainActiveList,
    mainRealm,
    mainTransactionNews,
  }: Pick<HomeLayoutProps, "mainActiveList" | "mainRealm" | "mainTransactionNews">) => (
    <>
      {mainActiveList}
      {mainRealm}
      {mainTransactionNews}
    </>
  ),
);

IndexerDependentComponents.displayName = "IndexerDependentComponents";

export default HomeLayout;
