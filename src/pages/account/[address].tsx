import React from "react";

import AccountLayout from "@/layouts/account/AccountLayout";
const AccountAddressContainer = React.lazy(
  () => import("@/containers/account/account-address-container/AccountAddressContainer"),
);
const AccountAssetsContainer = React.lazy(
  () => import("@/containers/account/account-assets-container/AccountAssetsContainer"),
);
const AccountTransactionsContainer = React.lazy(
  () => import("@/containers/account/account-transactions-container/AccountTransactionsContainer"),
);

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
