import React from "react";

import * as S from "./RealmsLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { RealmsSummary } from "@/components/view/list-summary/RealmsSummary";

interface RealmsLayoutProps {
  realmList: React.ReactNode;
}

const RealmsLayout = ({ realmList }: RealmsLayoutProps) => {
  // Summaries come from the API, which custom networks do not have.
  const { isCustomNetwork } = useNetworkProvider();

  return (
    <S.Container>
      <S.InnerLayout>
        <S.Wrapper>
          <PageTitle
            title="Realms"
            type="h2"
            description="Realms deployed on gno.land. See what is new, what is hot, and how busy the network is."
          />
          {!isCustomNetwork && <RealmsSummary />}
          {realmList}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default RealmsLayout;
