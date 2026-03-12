import React from "react";
import { useRouter } from "next/router";

import AccountLayout from "@/layouts/account/AccountLayout";
import AccountAddressContainer from "@/containers/account/account-address-container/AccountAddressContainer";
import AccountAssetsContainer from "@/containers/account/account-assets-container/AccountAssetsContainer";
import AccountTransactionsContainer from "@/containers/account/account-transactions-container/AccountTransactionsContainer";
import { useGetValidatorByAddress } from "@/common/react-query/validator/api";

export default function Page() {
  const router = useRouter();
  const { address: accountAddress } = router.query;

  const address = accountAddress as string;

  const { data: validatorData, isFetched: isFetchedValidator } = useGetValidatorByAddress(address);

  const isValidator = React.useMemo(() => {
    return !!validatorData?.name;
  }, [validatorData]);

  const validatorInfo = React.useMemo(() => {
    if (!validatorData?.name) return null;
    return {
      name: validatorData.name,
      proposalId: validatorData.proposalId,
    };
  }, [validatorData]);

  return (
    <>
      <AccountLayout
        address={address}
        isValidator={isValidator}
        isFetchedValidator={isFetchedValidator}
        validatorInfo={validatorInfo}
        accountAddress={<AccountAddressContainer address={address} validatorInfo={validatorInfo} />}
        accountAssets={<AccountAssetsContainer address={address} />}
        accountTransactions={<AccountTransactionsContainer address={address} />}
      />
    </>
  );
}
