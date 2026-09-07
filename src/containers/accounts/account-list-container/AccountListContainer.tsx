import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { AccountListDatatable } from "@/components/view/accounts/account-list-datatable/AccountListDatatable";

const AccountListContainer = () => {
  const { isCustomNetwork } = useNetworkProvider();

  return <AccountListDatatable isCustomNetwork={isCustomNetwork} />;
};

export default AccountListContainer;
