import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import * as S from "./HomeLayout.styles";
import IndexerClientConnectionFailureNotice from "./components/indexer-client-connection-failure-notice/IndexerClientConnectionFailureNotice";

interface HomeLayoutProps {
  mainCard: React.ReactNode;
  mainActiveList: React.ReactNode;
  mainRealm: React.ReactNode;
  mainTransactionNews: React.ReactNode;
}

const HomeLayout = ({ mainCard, mainActiveList, mainRealm, mainTransactionNews }: HomeLayoutProps) => {
  const { currentNetwork, indexerQueryClient } = useNetworkProvider();
  // The network resolves after hydration. Hide the sections only once it has no indexer.
  const showIndexerSections = !currentNetwork || Boolean(indexerQueryClient);

  return (
    <S.Container>
      <S.Wrapper>
        {mainCard}
        {showIndexerSections && (
          <IndexerDependentComponents
            mainActiveList={mainActiveList}
            mainRealm={mainRealm}
            mainTransactionNews={mainTransactionNews}
          />
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

IndexerDependentComponents.displayName = "IndexerDependentHomeLayoutComponents";

export default HomeLayout;
