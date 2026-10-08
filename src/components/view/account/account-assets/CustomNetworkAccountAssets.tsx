import React from "react";

import { useAccount } from "@/common/hooks/account/use-account";
import { useUsername } from "@/common/hooks/account/use-username";
import { isBech32Address } from "@/common/utils/bech32.utility";
import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { AccountAssetViewModel } from "@/types/account";
import { Amount } from "@/types/data-type";

import AccountAssetItem from "@/layouts/account/components/account-asset-item/AccountAssetItem";
import AccountAddressSkeleton from "../account-address/AccountAddressSkeleton";
import * as S from "./AccountAssets.styles";
import { CardTitle } from "../account-address/AccountAddress.styles";

interface AccountAssetsProps {
  address: string;
  breakpoint: DEVICE_TYPE;
}

const CustomNetworkAccountAssets = ({ address, breakpoint }: AccountAssetsProps) => {
  const { isFetched: isFetchedUsername, isLoading: isLoadingUsername, getAddress } = useUsername();

  const bech32Address = React.useMemo(() => {
    if (!isFetchedUsername) return "";
    if (isBech32Address(address)) return address;
    return getAddress(address) || "";
  }, [address, isFetchedUsername, getAddress]);

  const { isFetchedAssets, isLoadingAssets, tokenBalances } = useAccount(bech32Address || "");

  const tokenAssets: AccountAssetViewModel[] = React.useMemo(() => {
    if (!tokenBalances) return [];

    return tokenBalances.map((asset: Amount): AccountAssetViewModel => {
      return {
        tokenId: "",
        slug: "",
        amount: { value: asset.value, denom: asset.denom },
        packagePath: "",
        logoUrl: "",
      };
    });
  }, []);

  const isLoading = isLoadingUsername || isLoadingAssets;
  const isFetched = isFetchedUsername && isFetchedAssets;

  if (isLoading || !isFetched) {
    return <AccountAddressSkeleton />;
  }

  return (
    <S.Card>
      <CardTitle aria-label="title">Assets</CardTitle>
      <S.GridLayout breakpoint={breakpoint}>
        {isFetchedAssets &&
          tokenAssets.map((tokenAsset: AccountAssetViewModel) => {
            return (
              <AccountAssetItem
                key={`asset-token-${tokenAsset.amount.denom}`}
                amount={tokenAsset.amount}
                logoUrl={tokenAsset.logoUrl}
                isFetched={isFetchedAssets}
              />
            );
          })}
      </S.GridLayout>
    </S.Card>
  );
};

export default CustomNetworkAccountAssets;
