import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";
import { useUsername } from "@/common/hooks/account/use-username";
import { useAccount } from "@/common/hooks/account/use-account";
import { isBech32Address } from "@/common/utils/bech32.utility";

import AccountAssets from "@/components/view/account/account-assets/AccountAssets";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import CustomNetworkAccountAssets from "@/components/view/account/account-assets/CustomNetworkAccountAssets";
import StandardNetworkAccountAssets from "@/components/view/account/account-assets/StandardNetworkAccountAssets";

interface AccountAssetsContainerProps {
  address: string;
}

const AccountAssetsContainer = ({ address }: AccountAssetsContainerProps) => {
  const { breakpoint, isDesktop } = useWindowSize();
  const { isCustomNetwork } = useNetworkProvider();
  const { isFetched: isFetchedUsername, isLoading: isLoadingUsername, getAddress } = useUsername();

  const bech32Address = React.useMemo(() => {
    if (!isFetchedUsername) return "";
    if (isBech32Address(address)) return address;
    return getAddress(address) || "";
  }, [address, isFetchedUsername, getAddress]);

  const { isFetchedAssets, isLoadingAssets, tokenBalances } = useAccount(bech32Address || "");

  return isCustomNetwork ? (
    <CustomNetworkAccountAssets
      breakpoint={breakpoint}
      isDesktop={isDesktop}
      isFetched={isFetchedUsername && isFetchedAssets}
      isLoading={isLoadingUsername || isLoadingAssets}
      tokenBalances={tokenBalances}
      isFetchedAssets={isFetchedAssets}
    />
  ) : (
    <StandardNetworkAccountAssets address={address} breakpoint={breakpoint} isDesktop={isDesktop} />
  );
};

export default AccountAssetsContainer;
