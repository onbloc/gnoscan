import React from "react";
import type { GetServerSidePropsContext } from "next";
import axios from "axios";

import AccountLayout from "@/layouts/account/AccountLayout";
import AccountAddressContainer from "@/containers/account/account-address-container/AccountAddressContainer";
import AccountAssetsContainer from "@/containers/account/account-assets-container/AccountAssetsContainer";
import AccountTransactionsContainer from "@/containers/account/account-transactions-container/AccountTransactionsContainer";
import { useGetValidatorByAddress } from "@/common/react-query/validator/api";
import { getDefaultChain, getNetworkConfig } from "@/common/config/network.config";
import { SEARCH_RESULT_TYPE } from "@/common/values/search.constant";
import { GetSearchResponse } from "@/repositories/api/search/response";
import DefaultChainData from "public/resource/chains.json";

const REALM_LOOKUP_TIMEOUT_MS = 5_000;

export async function getServerSideProps({ params, query }: GetServerSidePropsContext) {
  const address = typeof params?.address === "string" ? params.address : null;
  const isCustomNetwork = query.type === "custom";

  if (!address || isCustomNetwork) {
    return { props: { address: address || "" } };
  }

  const networks = getNetworkConfig(DefaultChainData);
  const defaultChain = getDefaultChain(networks) || networks[0];
  const requestedChainId = typeof query.chainId === "string" ? query.chainId : null;
  const selectedChain = networks.find(network => network.chainId === requestedChainId) || defaultChain;

  if (!selectedChain?.apiUrl) {
    return { props: { address } };
  }

  try {
    const client = axios.create({
      baseURL: selectedChain.apiUrl,
      timeout: REALM_LOOKUP_TIMEOUT_MS,
      headers: { "Content-Type": "application/json" },
    });
    const { data } = await client.get<{ data: GetSearchResponse }>(`/search?param=${encodeURIComponent(address)}`);
    const results = data.data;
    const realm = results.find(result => result.type === SEARCH_RESULT_TYPE.REALM);

    if (realm) {
      // Realm details reads the raw package path from the URL, so its slashes must not be encoded.
      const chainIdQuery =
        selectedChain.chainId !== defaultChain?.chainId ? `&chainId=${encodeURIComponent(selectedChain.chainId)}` : "";

      return {
        redirect: {
          destination: `/realms/details?path=${realm.title}${chainIdQuery}`,
          permanent: false,
        },
      };
    }
  } catch {
    // Keep the account page available if the realm lookup service is temporarily unavailable.
  }

  return { props: { address } };
}

interface PageProps {
  address: string;
}

export default function Page({ address }: PageProps) {
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
