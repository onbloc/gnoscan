import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import CustomNetworkAccountAssets from "@/components/view/account/account-assets/CustomNetworkAccountAssets";
import StandardNetworkAccountAssets from "@/components/view/account/account-assets/StandardNetworkAccountAssets";

interface AccountAssetsContainerProps {
  address: string;
}

const AccountAssetsContainer = ({ address }: AccountAssetsContainerProps) => {
  const { breakpoint, isDesktop } = useWindowSize();
  const { isCustomNetwork } = useNetworkProvider();

  return isCustomNetwork ? (
    <CustomNetworkAccountAssets address={address} breakpoint={breakpoint} isDesktop={isDesktop} />
  ) : (
    <StandardNetworkAccountAssets address={address} breakpoint={breakpoint} isDesktop={isDesktop} />
  );
};

export default AccountAssetsContainer;
