import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import CustomNetworkAccountTransactions from "@/components/view/account/account-transactions/CustomNetworkAccountTransactions";
import StandardNetworkAccountTransactions from "@/components/view/account/account-transactions/StandardNetworkAccountTransactions";

interface AccountTransactionsContainerProps {
  address: string;
}

const AccountTransactionsContainer = ({ address }: AccountTransactionsContainerProps) => {
  const { isCustomNetwork, currentNetwork } = useNetworkProvider();

  return isCustomNetwork ? (
    <CustomNetworkAccountTransactions address={address} />
  ) : (
    // Remount on account or network change so keepPreviousData does not show the previous identity's rows
    <StandardNetworkAccountTransactions key={`${currentNetwork?.chainId}:${address}`} address={address} />
  );
};

export default AccountTransactionsContainer;
