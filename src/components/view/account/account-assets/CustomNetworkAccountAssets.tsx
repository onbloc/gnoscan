import React from "react";

import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { Amount } from "@/types/data-type";
import { useUsername } from "@/common/hooks/account/use-username";
import { isBech32Address } from "@/common/utils/bech32.utility";
import { useAccount } from "@/common/hooks/account/use-account";
import { AccountAssetViewModel } from "@/types/account";

import * as S from "./AccountAssets.styles";
import Text from "@/components/ui/text";
import AccountAddressSkeleton from "../account-address/AccountAddressSkeleton";
import AccountAssetItem from "@/layouts/account/components/account-asset-item/AccountAssetItem";

interface AccountAssetsProps {
  address: string;
  breakpoint: DEVICE_TYPE;
  isDesktop: boolean;
}

const CustomNetworkAccountAssets = ({ address, breakpoint, isDesktop }: AccountAssetsProps) => {
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
        amount: { value: asset.value, denom: asset.denom },
        packagePath: "",
        logoUrl: "",
      };
    });
  }, []);

  const isLoading = isLoadingUsername || isLoadingAssets;
  const isFetched = isFetchedUsername && isFetchedAssets;

  if (isLoading || !isFetched) {
    return <AccountAddressSkeleton isDesktop={isDesktop} />;
  }

  return (
    <S.Card breakpoint={breakpoint}>
      <Text aria-label="title" type={isDesktop ? "h4" : "h6"} color="primary">
        Assets
      </Text>
      <S.GridLayout breakpoint={breakpoint}>
        {isFetchedAssets &&
          tokenAssets.map((tokenAsset: AccountAssetViewModel) => {
            return (
              <AccountAssetItem
                key={`asset-token-${tokenAsset.amount.denom}`}
                amount={tokenAsset.amount}
                logoUrl={tokenAsset.logoUrl}
                breakpoint={breakpoint}
                isDesktop={isDesktop}
                isFetched={isFetchedAssets}
              />
            );
          })}
      </S.GridLayout>
    </S.Card>
  );
};

export default CustomNetworkAccountAssets;
