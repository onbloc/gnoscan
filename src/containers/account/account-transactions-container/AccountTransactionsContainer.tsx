import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useUsername } from "@/common/hooks/account/use-username";
import { useAccount } from "@/common/hooks/account/use-account";
import { isBech32Address } from "@/common/utils/bech32.utility";

import AccountTransactions from "@/components/view/account/account-transactions/AccountTransactions";
import { useWindowSize } from "@/common/hooks/use-window-size";
import CustomNetworkAccountTransactions from "@/components/view/account/account-transactions/CustomNetworkAccountTransactions";
import StandardNetworkAccountTransactions from "@/components/view/account/account-transactions/StandardNetworkAccountTransactions";

interface AccountTransactionsContainerProps {
  address: string;
}

const AccountTransactionsContainer = ({ address }: AccountTransactionsContainerProps) => {
  const { isDesktop } = useWindowSize();
  const { isCustomNetwork } = useNetworkProvider();

  const { isFetched: isFetchedUsername, isLoading: isLoadingUsername, getAddress } = useUsername();

  const bech32Address = React.useMemo(() => {
    if (!isFetchedUsername) return "";
    if (isBech32Address(address)) return address;
    return getAddress(address) || "";
  }, [address, isFetchedUsername, getAddress]);

  const { isFetchedAccountTransactions, isLoadingTransactions, transactionEvents } = useAccount(bech32Address || "");

  return isCustomNetwork ? (
    <CustomNetworkAccountTransactions
      address={bech32Address}
      transactionEvents={transactionEvents}
      isDesktop={isDesktop}
      isFetched={isFetchedAccountTransactions && isFetchedUsername}
      isLoading={isLoadingTransactions || isLoadingUsername}
    />
  ) : (
    <StandardNetworkAccountTransactions
      address={bech32Address}
      transactionEvents={transactionEvents}
      isDesktop={isDesktop}
      isFetched={isFetchedAccountTransactions && isFetchedUsername}
      isLoading={isLoadingTransactions || isLoadingUsername}
    />
  );
};

export default AccountTransactionsContainer;
