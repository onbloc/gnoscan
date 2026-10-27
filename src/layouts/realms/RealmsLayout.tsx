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
            description="Realms deployed on Gno.land — who's building, what's being used, and what lives on-chain."
          />
          {!isCustomNetwork && <RealmsSummary />}
          {realmList}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default RealmsLayout;
