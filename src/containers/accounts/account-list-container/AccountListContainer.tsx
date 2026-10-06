import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { AccountListDatatable } from "@/components/view/accounts/account-list-datatable/AccountListDatatable";

const AccountListContainer = () => {
  const { currentNetwork, isCustomNetwork } = useNetworkProvider();

  // Remount on network change to reset page and avoid showing previous network rows
  return <AccountListDatatable key={currentNetwork?.chainId} isCustomNetwork={isCustomNetwork} />;
};

export default AccountListContainer;
