import React from "react";
import BigNumber from "bignumber.js";

import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { Amount } from "@/types/data-type";
import { GNOTToken } from "@/common/hooks/common/use-token-meta";

import * as S from "./AccountAssets.styles";
import Text from "@/components/ui/text";
import AccountAddressSkeleton from "../account-address/AccountAddressSkeleton";
import AccountAssetItem from "@/layouts/account/components/account-asset-item/AccountAssetItem";
import { useGetAccountByAddress } from "@/common/react-query/account/api/use-get-account-by-address";
import { useGetNativeTokenBalance } from "@/common/react-query/account";
import { useGetTokenMetaByPath } from "@/common/react-query/token/api/use-get-token-meta-by-path";

interface AccountAssetsProps {
  address: string;
  breakpoint: DEVICE_TYPE;
  isDesktop: boolean;
}

interface AssetList {
  amount: Amount;
  logoUrl: string;
}

const StandardNetworkAccountAssets = ({ address, breakpoint, isDesktop }: AccountAssetsProps) => {
  const { data, isLoading, isFetched } = useGetAccountByAddress(address);

  const assetList: AssetList[] = React.useMemo(() => {
    if (!data?.data) return [];

    return data.data.assets
      .filter(asset => asset.name && asset.symbol)
      .map(asset => {
        return {
          amount: {
            value: asset.amount,
            denom: asset.symbol,
          },
          logoUrl: asset.logoUrl,
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
        <NativeTokenAsset address={address} breakpoint={breakpoint} isDesktop={isDesktop} />
        {isFetched &&
          assetList.map((asset: AssetList) => {
            return (
              <AccountAssetItem
                key={`asset-token-${asset.amount.denom}`}
                amount={asset.amount}
                logoUrl={asset.logoUrl}
                breakpoint={breakpoint}
                isDesktop={isDesktop}
                isFetched={isFetched}
              />
            );
          })}
      </S.GridLayout>
    </S.Card>
  );
};

const NativeTokenAsset = ({ address, breakpoint, isDesktop }: AccountAssetsProps) => {
  const { data, isFetched } = useGetNativeTokenBalance(address);

  const { data: GNOTmetadata } = useGetTokenMetaByPath(GNOTToken.denom);

  const amount: Amount = {
    denom: GNOTToken.denom,
    value: BigNumber(data?.value || 0).toString(),
  };

  return (
    <AccountAssetItem
      key={`asset-token-${amount.denom}`}
      amount={amount}
      logoUrl={GNOTmetadata?.data.logoUrl || ""}
      breakpoint={breakpoint}
      isDesktop={isDesktop}
      isFetched={isFetched}
    />
  );
};

export default StandardNetworkAccountAssets;
