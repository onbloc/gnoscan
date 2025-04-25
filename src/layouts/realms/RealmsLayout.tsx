import React from "react";

import * as S from "./RealmsLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";

interface RealmsLayoutProps {
  realmList: React.ReactNode;
}

const RealmsLayout = ({ realmList }: RealmsLayoutProps) => {
  return (
    <S.Container>
      <S.InnerLayout>
        <S.Wrapper>
          <PageTitle title="Realms" type="h2" />
          {realmList}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default RealmsLayout;
