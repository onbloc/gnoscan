import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";

import * as S from "./Realmlayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";

interface RealmLayoutProps {
  realmSummary: React.ReactNode;
  realmInfo: React.ReactNode;
}

const RealmLayout = ({ realmSummary, realmInfo }: RealmLayoutProps) => {
  const { breakpoint, isDesktop } = useWindowSize();

  return (
    <S.Container breakpoint={breakpoint}>
      <S.InnerLayout>
        <S.Wrapper breakpoint={breakpoint}>
          <PageTitle type={isDesktop ? "h2" : "p2"} title="Realm Details" />
          {realmSummary}
          {realmInfo}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default RealmLayout;
