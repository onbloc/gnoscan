import React from "react";

import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { Amount } from "@/types/data-type";

import * as S from "./AccountAssets.styles";
import Text from "@/components/ui/text";
import AccountAddressSkeleton from "../account-address/AccountAddressSkeleton";
import AccountAssetItem from "@/layouts/account/components/account-asset-item/AccountAssetItem";
import { useGetAccountByAddress } from "@/common/react-query/account/api/use-get-account-by-address";

interface AccountAssetsProps {
  address: string;
  breakpoint: DEVICE_TYPE;
  isDesktop: boolean;
}

const StandardNetworkAccountAssets = ({ address, breakpoint, isDesktop }: AccountAssetsProps) => {
  const { data, isLoading, isFetched } = useGetAccountByAddress(address);

  const assetList = React.useMemo(() => {
    if (!data?.data) return [];
    return data.data.assets.map(asset => {
      return {
        denom: "ugnot",
        value: asset.amount,
      };
    });
  }, [data?.data]);

  if (isLoading || !isFetched) {
    return <AccountAddressSkeleton isDesktop={isDesktop} />;
  }

  return (
    <S.Card breakpoint={breakpoint}>
      <Text aria-label="title" type={isDesktop ? "h4" : "h6"} color="primary">
        Assets
      </Text>
      <S.GridLayout breakpoint={breakpoint}>
        {isFetched &&
          assetList.map((amount: Amount) => {
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

export default StandardNetworkAccountAssets;
