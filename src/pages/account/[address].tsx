import React from "react";
import { useRouter } from "next/router";

import AccountLayout from "@/layouts/account/AccountLayout";
import AccountAddressContainer from "@/containers/account/account-address-container/AccountAddressContainer";
import AccountAssetsContainer from "@/containers/account/account-assets-container/AccountAssetsContainer";
import AccountTransactionsContainer from "@/containers/account/account-transactions-container/AccountTransactionsContainer";
import { useGetValidatorByAddress } from "@/common/react-query/validator/api";
import { useGetAccountByAddress } from "@/common/react-query/account/api/use-get-account-by-address";
import { useNetwork } from "@/common/hooks/use-network";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { getAddressLinkPath } from "@/common/utils/address-label.utility";

export default function Page() {
  const router = useRouter();
  const { address: accountAddress } = router.query;

  const address = accountAddress as string;

  const { isCustomNetwork } = useNetworkProvider();
  const { getUrlWithNetwork } = useNetwork();

  const { data: validatorData, isFetched: isFetchedValidator } = useGetValidatorByAddress(address);

  // Same rule the search bar uses: a realm address always goes to its realm page, regardless
  // of a resolved name - unlike getAddressLinkPath's other callers, this isn't displaying text
  // the link needs to match, so no name is passed in here.
  const { data: accountData } = useGetAccountByAddress(address, {
    enabled: !isCustomNetwork && !!address,
  });

  React.useEffect(() => {
    if (isCustomNetwork || !address || !accountData?.data) return;

    const { label, labelType } = accountData.data;
    const linkPath = getAddressLinkPath({ address, label, labelType });
    if (linkPath.startsWith("/realms/details")) {
      router.replace(getUrlWithNetwork(linkPath));
    }
  }, [isCustomNetwork, address, accountData, getUrlWithNetwork, router]);

  const isValidator = React.useMemo(() => {
    return !!validatorData?.name;
  }, [validatorData]);

  const validatorInfo = React.useMemo(() => {
    if (!validatorData?.name) return null;
    return {
      name: validatorData.name,
      operationAddress: validatorData.operationAddress,
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
