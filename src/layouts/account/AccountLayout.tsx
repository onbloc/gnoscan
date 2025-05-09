import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";
import { useUsername } from "@/common/hooks/account/use-username";
import { isBech32Address } from "@/common/utils/bech32.utility";

import * as S from "./AccountLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";
import NotFound from "@/components/view/search/not-found/NotFound";

interface AccountLayoutProps {
  address: string;
  accountAddress: React.ReactNode;
  accountAssets: React.ReactNode;
  accountTransactions: React.ReactNode;
}

const AccountLayout = ({ address, accountAddress, accountAssets, accountTransactions }: AccountLayoutProps) => {
  const { breakpoint, isDesktop } = useWindowSize();
  const { getAddress } = useUsername();

  const bech32Address = React.useMemo(() => {
    if (isBech32Address(address)) {
      return address;
    }
    return getAddress(address) || null;
  }, [address]);

  const hasError = React.useMemo(() => !bech32Address, [bech32Address]);

  if (hasError)
    return (
      <S.InnerLayout>
        <NotFound keyword={address} breakpoint={breakpoint} />
      </S.InnerLayout>
    );

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
