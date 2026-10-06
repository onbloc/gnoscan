import React from "react";

import * as S from "./AccountsLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";

interface AccountsLayoutProps {
  accountList: React.ReactNode;
}

const AccountsLayout = ({ accountList }: AccountsLayoutProps) => {
  return (
    <S.Container>
      <S.InnerLayout>
        <S.Wrapper>
          <PageTitle title="Accounts" type="h2" />
          {accountList}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default AccountsLayout;
