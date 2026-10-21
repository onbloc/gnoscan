import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import CustomNetworkAccountAddress from "@/components/view/account/account-address/CustomNetworkAccountAddress";
import StandardNetworkAccountAddress from "@/components/view/account/account-address/StandardNetweorkAccountAddress";
import { ValidatorInfo } from "@/layouts/account/AccountLayout";

interface AccountAddressContainerProps {
  address: string;
  validatorInfo?: ValidatorInfo | null;
}

const AccountAddressContainer = ({ address, validatorInfo }: AccountAddressContainerProps) => {
  const { isCustomNetwork } = useNetworkProvider();

  return isCustomNetwork ? (
    <CustomNetworkAccountAddress address={address} />
  ) : (
    <StandardNetworkAccountAddress address={address} validatorInfo={validatorInfo} />
  );
};

export default AccountAddressContainer;
