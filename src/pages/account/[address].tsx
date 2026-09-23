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
import LoadingPage from "@/components/view/loading/page";

export default function Page() {
  const router = useRouter();
  const { address: accountAddress } = router.query;

  const address = typeof accountAddress === "string" ? accountAddress : "";

  const { currentNetwork, isCustomNetwork } = useNetworkProvider();
  const { getUrlWithNetwork } = useNetwork();

  // Route realms by their label even when the address also has a resolved name.
  const { data: accountData, isFetched: isFetchedAccount } = useGetAccountByAddress(address, {
    enabled: router.isReady && !!currentNetwork && !isCustomNetwork && !!address,
  });

  const linkPath =
    !isCustomNetwork && accountData?.data
      ? getAddressLinkPath({ address, label: accountData.data.label, labelType: accountData.data.labelType })
      : null;
  const realmDestination = linkPath?.startsWith("/realms/details") ? getUrlWithNetwork(linkPath) : null;

  React.useEffect(() => {
    if (router.isReady && currentNetwork && realmDestination) {
      void router.replace(realmDestination);
    }
  }, [router, currentNetwork, realmDestination]);

  // Do not mount account panels (or start their queries) for an unresolved or realm address.
  if (!router.isReady || !currentNetwork || (!isCustomNetwork && (!isFetchedAccount || realmDestination))) {
    return (
      <div className="inner-layout">
        <LoadingPage />
      </div>
    );
  }

  return <AccountPage address={address} />;
}

function AccountPage({ address }: { address: string }) {
  const { data: validatorData, isFetched: isFetchedValidator } = useGetValidatorByAddress(address);

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
