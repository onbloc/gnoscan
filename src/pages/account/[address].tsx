import React from "react";

import AccountLayout from "@/layouts/account/AccountLayout";
import AccountAddressContainer from "@/containers/account/account-address-container/AccountAddressContainer";
import AccountAssetsContainer from "@/containers/account/account-assets-container/AccountAssetsContainer";
import AccountTransactionsContainer from "@/containers/account/account-transactions-container/AccountTransactionsContainer";

interface AccountDetailsPageProps {
  address: string;
  redirectUrl: string | null;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getServerSideProps({ params }: any) {
  const keyword = params.address;
  return {
    props: {
      address: keyword,
      redirectUrl: null,
    },
  };
}

export default function Page({ address }: AccountDetailsPageProps) {
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
