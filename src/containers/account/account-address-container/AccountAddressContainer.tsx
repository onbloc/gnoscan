import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import CustomNetworkAccountAddress from "@/components/view/account/account-address/CustomNetworkAccountAddress";
import StandardNetworkAccountAddress from "@/components/view/account/account-address/StandardNetweorkAccountAddress";

interface AccountAddressContainerProps {
  address: string;
}

const AccountAddressContainer = ({ address }: AccountAddressContainerProps) => {
  const { breakpoint, isDesktop } = useWindowSize();
  const { isCustomNetwork } = useNetworkProvider();

  return isCustomNetwork ? (
    <CustomNetworkAccountAddress breakpoint={breakpoint} isDesktop={isDesktop} address={address} />
  ) : (
    <StandardNetworkAccountAddress breakpoint={breakpoint} isDesktop={isDesktop} address={address} />
  );
};

export default AccountAddressContainer;
