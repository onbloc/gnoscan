import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";
import { useNetwork } from "@/common/hooks/use-network";
import { useUsername } from "@/common/hooks/account/use-username";
import { isBech32Address } from "@/common/utils/bech32.utility";

import AccountAddress from "@/components/view/account/account-address/AccountAddress";

interface AccountAddressContainerProps {
  address: string;
}

const AccountAddressContainer = ({ address }: AccountAddressContainerProps) => {
  const { breakpoint, isDesktop } = useWindowSize();
  const { isFetched: isFetchedUsername, isLoading: isLoadingUsername, getName, getAddress, getUserUrl } = useUsername();
  const { currentNetwork } = useNetwork();

  const bech32Address = React.useMemo(() => {
    if (!isFetchedUsername) return "";
    if (isBech32Address(address)) return address;
    return getAddress(address) || "";
  }, [address, isFetchedUsername, getAddress]);

  const userName = React.useMemo(() => {
    if (!isFetchedUsername || !bech32Address) return null;
    return getName(bech32Address);
  }, [bech32Address, isFetchedUsername, getName]);

  const userUrl = React.useMemo(() => {
    if (!userName || !currentNetwork) return null;
    return getUserUrl(currentNetwork.chainId, userName);
  }, [currentNetwork, userName]);

  return (
    <AccountAddress
      breakpoint={breakpoint}
      isDesktop={isDesktop}
      isFetched={isFetchedUsername}
      isLoading={isLoadingUsername}
      address={bech32Address}
      userName={userName}
      userUrl={userUrl}
    />
  );
};

export default AccountAddressContainer;
