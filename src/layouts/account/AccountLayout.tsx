import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";
import { useUsername } from "@/common/hooks/account/use-username";
import { isBech32Address } from "@/common/utils/bech32.utility";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import * as S from "./AccountLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";
import NotFound from "@/components/view/search/not-found/NotFound";
import { useGetAccountByAddress } from "@/common/react-query/account/api/use-get-account-by-address";
import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";

export interface ValidatorInfo {
  name: string;
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
  const { breakpoint, isDesktop } = useWindowSize();
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
  const hasErrorStandardNetwork = React.useMemo(
    () => !isCustomNetwork && isFetchedAccount && (!account || !account?.data),
    [isCustomNetwork, address, isFetchedAccount],
  );

  const pageTitle = isValidator ? "Validator Details" : "Account Details";

  const isLoadingPageTitle = !isCustomNetwork && !isFetchedValidator;

  if (hasErrorCustomNetwork || hasErrorStandardNetwork)
    return (
      <S.InnerLayout>
        <NotFound keyword={address} breakpoint={breakpoint} />
      </S.InnerLayout>
    );

  return (
    <S.Container breakpoint={breakpoint}>
      <S.InnerLayout>
        <S.Wrapper breakpoint={breakpoint}>
          {isLoadingPageTitle ? (
            <SkeletonBar width={200} height={isDesktop ? 36 : 24} />
          ) : (
            <PageTitle type={isDesktop ? "h2" : "p2"} title={pageTitle} />
          )}
          {accountAddress}
          {accountAssets}
          {accountTransactions}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default AccountLayout;
