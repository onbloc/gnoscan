import React from "react";

import * as S from "./ValidatorsLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";

interface ValidatorsLayoutProps {
  validators: React.ReactNode;
}

const ValidatorsLayout = ({ validators }: ValidatorsLayoutProps) => {
  return (
    <S.Container>
      <S.InnerLayout>
        <S.Wrapper>
          <PageTitle title="Validators" type="h2" />
          {validators}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default ValidatorsLayout;
