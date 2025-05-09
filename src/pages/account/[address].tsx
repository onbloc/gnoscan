import React from "react";
import { useRouter } from "next/router";

import AccountLayout from "@/layouts/account/AccountLayout";
import AccountAddressContainer from "@/containers/account/account-address-container/AccountAddressContainer";
import AccountAssetsContainer from "@/containers/account/account-assets-container/AccountAssetsContainer";
import AccountTransactionsContainer from "@/containers/account/account-transactions-container/AccountTransactionsContainer";

export default function Page() {
  const router = useRouter();
  const { address: accountAddress } = router.query;

  const address = accountAddress as string;

  return (
    <>
      <AccountLayout
        address={address}
        accountAddress={<AccountAddressContainer address={address} />}
        accountAssets={<AccountAssetsContainer address={address} />}
        accountTransactions={<AccountTransactionsContainer address={address} />}
      />
    </>
  );
}
