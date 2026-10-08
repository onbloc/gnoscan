import React from "react";

import { useUsername } from "@/common/hooks/account/use-username";
import { isBech32Address } from "@/common/utils/bech32.utility";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import * as S from "./AccountLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";
import NotFound from "@/components/view/search/not-found/NotFound";
import { useGetAccountByAddress } from "@/common/react-query/account/api/use-get-account-by-address";
import AccountAddressSkeleton from "@/components/view/account/account-address/AccountAddressSkeleton";
import AccountTransactionsSkeleton from "@/components/view/account/account-transactions/AccountTransactionsSkeleton";

export interface ValidatorInfo {
  name: string;
  operationAddress: string | null;
  proposalId: string | null;
}

interface AccountLayoutProps {
  address: string;
  isValidator?: boolean;
  isFetchedValidator?: boolean;
  validatorInfo?: ValidatorInfo | null;
  accountAddress: React.ReactNode;
  accountAssets: React.ReactNode;
  accountTransactions: React.ReactNode;
}

const AccountLayout = ({
  address,
  isValidator = false,
  isFetchedValidator = false,
  validatorInfo,
  accountAddress,
  accountAssets,
  accountTransactions,
}: AccountLayoutProps) => {
  const { isCustomNetwork } = useNetworkProvider();

  const { getAddress } = useUsername();
  const { data: account, isFetched: isFetchedAccount } = useGetAccountByAddress(address);

  const bech32Address = React.useMemo(() => {
    if (isBech32Address(address)) {
      return address;
    }
    return getAddress(address) || null;
  }, [address]);

  const hasErrorCustomNetwork = React.useMemo(
    () => isCustomNetwork && !bech32Address,
    [isCustomNetwork, bech32Address],
  );
  const hasErrorStandardNetwork = React.useMemo(() => {
    if (isCustomNetwork || !isFetchedAccount) {
      return false;
    }

    if (!account?.data) {
      return true;
    }

    return !isBech32Address(address) && !account.data.name;
  }, [isCustomNetwork, address, isFetchedAccount, account?.data]);

  const pageTitle = isValidator ? "Validator Details" : "Account Details";

  const isLoadingPageTitle = !isCustomNetwork && !isFetchedValidator;

  if (hasErrorCustomNetwork || hasErrorStandardNetwork)
    return (
      <S.InnerLayout>
        <NotFound keyword={address} />
      </S.InnerLayout>
    );

  return (
    <AccountFrame>
      {isLoadingPageTitle ? <S.TitleSkeleton /> : <PageTitle type="p2" desktopType="h2" title={pageTitle} />}
      {accountAddress}
      {accountAssets}
      {accountTransactions}
    </AccountFrame>
  );
};

const AccountFrame = ({ children }: { children: React.ReactNode }) => {
  return (
    <S.Container>
      <S.InnerLayout>
        <S.Wrapper>{children}</S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

// Mirrors the loaded layout (address, assets, transactions) so the page does not jump
// while the address is classified; renders no query-bearing panels.
export const AccountLayoutSkeleton = () => {
  return (
    <AccountFrame>
      <S.TitleSkeleton />
      <AccountAddressSkeleton />
      <AccountAddressSkeleton />
      <AccountTransactionsSkeleton />
    </AccountFrame>
  );
};

export default AccountLayout;
