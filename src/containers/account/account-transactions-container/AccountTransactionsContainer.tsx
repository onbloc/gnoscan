import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import CustomNetworkAccountTransactions from "@/components/view/account/account-transactions/CustomNetworkAccountTransactions";
import StandardNetworkAccountTransactions from "@/components/view/account/account-transactions/StandardNetworkAccountTransactions";

interface AccountTransactionsContainerProps {
  address: string;
}

const AccountTransactionsContainer = ({ address }: AccountTransactionsContainerProps) => {
  const { isCustomNetwork } = useNetworkProvider();

  return isCustomNetwork ? (
    <CustomNetworkAccountTransactions address={address} />
  ) : (
    <StandardNetworkAccountTransactions address={address} />
  );
};

export default AccountTransactionsContainer;
