import BigNumber from "bignumber.js";
import React from "react";

import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { formatTokenDecimal } from "@/common/utils/token.utility";
import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { AccountAssetViewModel } from "@/types/account";

import { useGetNativeTokenBalance } from "@/common/react-query/account";
import { useGetAccountByAddress } from "@/common/react-query/account/api/use-get-account-by-address";
import Text from "@/components/ui/text";
import AccountAssetItem from "@/layouts/account/components/account-asset-item/AccountAssetItem";
import AccountAddressSkeleton from "../account-address/AccountAddressSkeleton";
import * as S from "./AccountAssets.styles";

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
      .map((asset): AccountAssetViewModel => {
        const amount = formatTokenDecimal(asset.amount, asset.decimals);
        return {
          tokenId: asset.tokenId,
          slug: asset.slug,
          amount: {
            value: amount,
            denom: asset.symbol,
          },
          packagePath: asset.packagePath,
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
                key={`asset-token-${grc20TokenAsset.tokenId}`}
                amount={grc20TokenAsset.amount}
                showTokenPathLink={true}
                tokenPath={grc20TokenAsset.packagePath}
                tokenId={grc20TokenAsset.tokenId}
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

  // Native denoms (e.g. ugnot) are not served by the token-meta API. Let
  // AccountAssetItem fall back to gno-token-resource via useTokenMeta for logo.
  const nativeTokenAsset: AccountAssetViewModel = React.useMemo(() => {
    return {
      tokenId: "",
      slug: "",
      amount: {
        value: BigNumber(data?.value || 0).toString(),
        denom: GNOTToken.denom,
      },
      packagePath: "",
      logoUrl: "",
    };
  }, [data?.value]);

  return (
    <AccountAssetItem
      key={`asset-token-${nativeTokenAsset.amount.denom}`}
      amount={nativeTokenAsset.amount}
      logoUrl={nativeTokenAsset.logoUrl}
      breakpoint={breakpoint}
      isDesktop={isDesktop}
      isFetched={isFetched}
    />
  );
};

export default StandardNetworkAccountAssets;
