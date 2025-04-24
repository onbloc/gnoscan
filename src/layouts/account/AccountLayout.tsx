import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";

import * as S from "./AccountLayout.styles";
import Text from "@/components/ui/text";

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
          <Text type={isDesktop ? "h2" : "p2"} color="primary">
            Account Details
          </Text>
          {accountAddress}
          {accountAssets}
          {accountTransactions}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default AccountLayout;
