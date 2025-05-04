import React from "react";

import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { Amount } from "@/types/data-type";

import * as S from "./AccountAssets.styles";
import Text from "@/components/ui/text";
import AccountAddressSkeleton from "../account-address/AccountAddressSkeleton";
import AccountAssetItem from "@/layouts/account/components/account-asset-item/AccountAssetItem";

interface AccountAssetsProps {
  breakpoint: DEVICE_TYPE;
  isDesktop: boolean;
  isFetched: boolean;
  isLoading: boolean;
  isFetchedAssets: boolean;
  tokenBalances: { value: string; denom: string }[];
}

const CustomNetworkAccountAssets = ({
  breakpoint,
  isDesktop,
  isFetched,
  isLoading,
  isFetchedAssets,
  tokenBalances,
}: AccountAssetsProps) => {
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
          tokenBalances.map((amount: Amount) => {
            return (
              <AccountAssetItem
                key={`asset-token-${amount.denom}`}
                amount={amount}
                breakpoint={breakpoint}
                isDesktop={isDesktop}
              />
            );
          })}
      </S.GridLayout>
    </S.Card>
  );
};

export default CustomNetworkAccountAssets;
