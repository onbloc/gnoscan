import React from "react";

import AccountsLayout from "@/layouts/accounts/AccountsLayout";
import AccountListContainer from "@/containers/accounts/account-list-container/AccountListContainer";

export default function Page() {
  return (
    <>
      <AccountsLayout accountList={<AccountListContainer />} />
    </>
  );
}
