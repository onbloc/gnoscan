import React from "react";
import styled from "styled-components";

import * as S from "./AccountsLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";
import Tooltip from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import IconAccountsInfo from "@/assets/svgs/icon-accounts-info.svg";

interface AccountsLayoutProps {
  accountList: React.ReactNode;
}

const AccountsLayout = ({ accountList }: AccountsLayoutProps) => {
  return (
    <S.Container>
      <S.InnerLayout>
        <S.Wrapper>
          <TitleRow>
            <PageTitle title="Accounts" type="h2" />
            <Tooltip content="Showing the top 1,000 accounts by GNOT balance" width={210}>
              <InfoButton>
                <IconAccountsInfo />
              </InfoButton>
            </Tooltip>
          </TitleRow>
          {accountList}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InfoButton = styled(Button)`
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  padding: 4px;
  border: 0;
  border-radius: 50%;
  background-color: ${({ theme }) => (theme.colors.base === "#121212" ? "#1a1a1a" : theme.colors.select)};
`;

export default AccountsLayout;
