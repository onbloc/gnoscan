import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";
import { useUsername } from "@/common/hooks/account/use-username";
import { useAccount } from "@/common/hooks/account/use-account";
import { isBech32Address } from "@/common/utils/bech32.utility";

import AccountAssets from "@/components/view/account/account-assets/AccountAssets";

interface AccountAssetsContainerProps {
  address: string;
}

const AccountAssetsContainer = ({ address }: AccountAssetsContainerProps) => {
  const { breakpoint, isDesktop } = useWindowSize();
  const { isFetched: isFetchedUsername, isLoading: isLoadingUsername, getAddress } = useUsername();

  const bech32Address = React.useMemo(() => {
    if (!isFetchedUsername) return "";
    if (isBech32Address(address)) return address;
    return getAddress(address) || "";
  }, [address, isFetchedUsername, getAddress]);

  const { isFetchedAssets, isLoadingAssets, tokenBalances } = useAccount(bech32Address || "");

  return (
    <AccountAssets
      breakpoint={breakpoint}
      isDesktop={isDesktop}
      isFetched={isFetchedUsername && isFetchedAssets}
      isLoading={isLoadingUsername || isLoadingAssets}
      tokenBalances={tokenBalances}
      isFetchedAssets={isFetchedAssets}
    />
  );
};

export default AccountAssetsContainer;
