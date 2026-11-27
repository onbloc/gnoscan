import React from "react";

import * as S from "./GovernanceLayout.styles";

interface GovernanceLayoutProps {
  governance: React.ReactNode;
}

const GovernanceLayout = ({ governance }: GovernanceLayoutProps) => (
  <S.Container>
    <S.InnerLayout>
      <S.Wrapper>{governance}</S.Wrapper>
    </S.InnerLayout>
  </S.Container>
);

export default GovernanceLayout;
