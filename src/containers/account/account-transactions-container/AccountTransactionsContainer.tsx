import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useWindowSize } from "@/common/hooks/use-window-size";

import CustomNetworkAccountTransactions from "@/components/view/account/account-transactions/CustomNetworkAccountTransactions";
import StandardNetworkAccountTransactions from "@/components/view/account/account-transactions/StandardNetworkAccountTransactions";

interface AccountTransactionsContainerProps {
  address: string;
}

const AccountTransactionsContainer = ({ address }: AccountTransactionsContainerProps) => {
  const { isDesktop } = useWindowSize();
  const { isCustomNetwork } = useNetworkProvider();

  return isCustomNetwork ? (
    <CustomNetworkAccountTransactions address={address} isDesktop={isDesktop} />
  ) : (
    <StandardNetworkAccountTransactions address={address} isDesktop={isDesktop} />
  );
};

export default AccountTransactionsContainer;
