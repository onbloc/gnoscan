import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";

import * as S from "./AccountLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";

interface AccountLayoutProps {
  accountAddress: React.ReactNode;
  accountAssets: React.ReactNode;
  accountTransactions: React.ReactNode;
}

const AccountLayout = ({ accountAddress, accountAssets, accountTransactions }: AccountLayoutProps) => {
  const { breakpoint, isDesktop } = useWindowSize();

  return (
    <S.Container breakpoint={breakpoint}>
      <S.InnerLayout>
        <S.Wrapper breakpoint={breakpoint}>
          <PageTitle type={isDesktop ? "h2" : "p2"} title="Account Details" />
          {accountAddress}
          {accountAssets}
          {accountTransactions}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default AccountLayout;
