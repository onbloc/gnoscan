import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useWindowSize } from "@/common/hooks/use-window-size";

import * as S from "./HomeLayout.styles";
import IndexerClientConnectionFailureNotice from "./components/indexer-client-connection-failure-notice/IndexerClientConnectionFailureNotice";

interface HomeLayoutProps {
  mainCard: React.ReactNode;
  mainActiveList: React.ReactNode;
  mainRealm: React.ReactNode;
  mainTransactionNews: React.ReactNode;
}

const HomeLayout = ({ mainCard, mainActiveList, mainRealm, mainTransactionNews }: HomeLayoutProps) => {
  const { breakpoint } = useWindowSize();
  const { currentNetwork, indexerQueryClient } = useNetworkProvider();
  // The network resolves after hydration, so keep the sections (as skeletons) until it is known
  // and hide them only when the resolved network has no indexer. Otherwise the server HTML ends
  // after the first section and everything below, including the footer, jumps once they mount.
  const showIndexerSections = !currentNetwork || Boolean(indexerQueryClient);

  return (
    <S.Container breakpoint={breakpoint}>
      <S.Wrapper breakpoint={breakpoint}>
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
