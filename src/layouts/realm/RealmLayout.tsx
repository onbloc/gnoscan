import React from "react";

import * as S from "./Realmlayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";

interface RealmLayoutProps {
  realmSummary: React.ReactNode;
  realmInfo: React.ReactNode;
}

const RealmLayout = ({ realmSummary, realmInfo }: RealmLayoutProps) => {
  return (
    <S.Container>
      <S.InnerLayout>
        <S.Wrapper>
          <PageTitle type="p2" desktopType="h2" title="Realm Details" />
          {realmSummary}
          {realmInfo}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default RealmLayout;
