import React from "react";
import BigNumber from "bignumber.js";

import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { AccountAssetViewModel } from "@/types/account";
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

const StandardNetworkAccountAssets = ({ address, breakpoint, isDesktop }: AccountAssetsProps) => {
  const { data, isLoading, isFetched } = useGetAccountByAddress(address);

  const grc20TokenAssets: AccountAssetViewModel[] = React.useMemo(() => {
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
          grc20TokenAssets.map((grc20TokenAsset: AccountAssetViewModel) => {
            return (
              <AccountAssetItem
                key={`asset-token-${grc20TokenAsset.amount.denom}`}
                amount={grc20TokenAsset.amount}
                logoUrl={grc20TokenAsset.logoUrl}
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

  const { data: GNOTmetadata, isFetched: isFetchedGNOTmetadata } = useGetTokenMetaByPath(GNOTToken.denom);

  const nativeTokenAsset: AccountAssetViewModel = React.useMemo(() => {
    return {
      amount: {
        value: BigNumber(data?.value || 0).toString(),
        denom: GNOTToken.denom,
      },
      logoUrl: GNOTmetadata?.data.logoUrl || "",
    };
  }, [data?.value, GNOTmetadata?.data.logoUrl]);

  const isFetchedNativeTokenAsset = isFetched && isFetchedGNOTmetadata;

  return (
    <AccountAssetItem
      key={`asset-token-${nativeTokenAsset.amount.denom}`}
      amount={nativeTokenAsset.amount}
      logoUrl={nativeTokenAsset.logoUrl}
      breakpoint={breakpoint}
      isDesktop={isDesktop}
      isFetched={isFetchedNativeTokenAsset}
    />
  );
};

export default StandardNetworkAccountAssets;
