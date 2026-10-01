import React from "react";
import styled from "styled-components";

import * as S from "./AccountsLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";
import Tooltip from "@/components/ui/tooltip";
import IconInfo from "@/assets/svgs/icon-info.svg";

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
              <InfoButton aria-label="Accounts list information">
                <IconInfo />
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

const InfoButton = styled.button`
  display: flex;
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${({ theme }) => (theme.colors.base === "#121212" ? "#1a1a1a" : theme.colors.select)};
  color: ${({ theme }) => theme.colors.primary};

  svg {
    width: 9px;
    height: 10px;
  }
`;

export default AccountsLayout;
