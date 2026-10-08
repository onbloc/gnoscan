import BigNumber from "bignumber.js";
import React from "react";

import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { useTokenResourceMeta } from "@/common/hooks/common/use-token-resource-meta";
import { formatTokenDecimal } from "@/common/utils/token.utility";
import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { AccountAssetViewModel } from "@/types/account";
import { AccountVestingModel } from "@/repositories/api/account/response";

import { useGetNativeTokenBalance } from "@/common/react-query/account";
import { useGetAccountByAddress } from "@/common/react-query/account/api/use-get-account-by-address";
import AccountAssetItem from "@/layouts/account/components/account-asset-item/AccountAssetItem";
import AccountAddressSkeleton from "../account-address/AccountAddressSkeleton";
import AccountVestingAsset from "./AccountVestingAsset";
import AccountAssetGrid from "./AccountAssetGrid";
import { isDisplayableAsset } from "./account-assets.utility";
import Text from "@/components/ui/text";
import * as S from "./AccountAssets.styles";
import { CardTitle } from "../account-address/AccountAddress.styles";

interface AccountAssetsProps {
  address: string;
  breakpoint: DEVICE_TYPE;
}

const StandardNetworkAccountAssets = ({ address, breakpoint }: AccountAssetsProps) => {
  const { data, isLoading, isFetched } = useGetAccountByAddress(address);
  const { data: nativeBalance, isFetched: isFetchedNativeBalance } = useGetNativeTokenBalance(address);
  const { getTokenMeta } = useTokenResourceMeta();

  const grc20TokenAssets: AccountAssetViewModel[] = React.useMemo(() => {
    if (!data?.data) return [];

    return data.data.assets
      .filter(asset => isDisplayableAsset(asset))
      .map((asset): AccountAssetViewModel => {
        const resolved = getTokenMeta(asset.tokenId || asset.packagePath, {
          name: asset.name,
          symbol: asset.symbol,
          decimals: asset.decimals,
          image: asset.logoUrl,
        });
        const amount = formatTokenDecimal(asset.amount, resolved.decimals);
        return {
          tokenId: asset.tokenId,
          slug: asset.slug,
          amount: {
            value: amount,
            denom: resolved.symbol,
          },
          packagePath: asset.packagePath,
          logoUrl: resolved.image ?? "",
          name: resolved.name,
        };
      });
  }, [data?.data, getTokenMeta]);

  if (isLoading || !isFetched) {
    return <AccountAddressSkeleton />;
  }

  const vesting = data?.data.vesting;
  // Zero balances are hidden; keep the native card while its balance loads so it can show its skeleton.
  const showNativeAsset = vesting
    ? !new BigNumber(vesting.total).isZero()
    : !isFetchedNativeBalance || !new BigNumber(nativeBalance?.value || 0).isZero();
  const hasAssets = showNativeAsset || grc20TokenAssets.length > 0;

  const renderGrc20Asset = (grc20TokenAsset: AccountAssetViewModel) => (
    <AccountAssetItem
      key={`asset-token-${grc20TokenAsset.tokenId}`}
      amount={grc20TokenAsset.amount}
      name={grc20TokenAsset.name}
      priceTokenKey={grc20TokenAsset.tokenId || grc20TokenAsset.packagePath}
      showTokenPathLink={true}
      tokenPath={grc20TokenAsset.packagePath}
      logoUrl={grc20TokenAsset.logoUrl}
      isFetched={isFetched}
    />
  );

  return (
    <S.Card>
      <CardTitle aria-label="title">Assets</CardTitle>
      {hasAssets ? (
        <AccountAssetGrid breakpoint={breakpoint}>
          {showNativeAsset && (
            <NativeTokenAsset
              balance={nativeBalance?.value}
              isFetched={isFetchedNativeBalance}
              vesting={vesting}
            />
          )}
          {grc20TokenAssets.map(renderGrc20Asset)}
        </AccountAssetGrid>
      ) : (
        <Text type="p4" color="tertiary">
          No data to display
        </Text>
      )}
    </S.Card>
  );
};

const NativeTokenAsset = ({
  balance,
  isFetched,
  vesting,
}: Omit<AccountAssetsProps, "address" | "breakpoint"> & {
  balance?: string;
  isFetched: boolean;
  vesting?: AccountVestingModel;
}) => {
  // Native denoms (e.g. ugnot) are not served by the token-meta API. Let
  // AccountAssetItem fall back to gno-token-resource via useTokenMeta for logo.
  const nativeTokenAsset: AccountAssetViewModel = React.useMemo(() => {
    return {
      tokenId: "",
      slug: "",
      amount: {
        value: BigNumber(balance || 0).toString(),
        denom: GNOTToken.denom,
      },
      packagePath: "",
      logoUrl: "",
      name: GNOTToken.name,
    };
  }, [balance]);

  if (vesting) {
    return <AccountVestingAsset vesting={vesting} />;
  }

  return (
    <AccountAssetItem
      key={`asset-token-${nativeTokenAsset.amount.denom}`}
      amount={nativeTokenAsset.amount}
      name={nativeTokenAsset.name}
      logoUrl={nativeTokenAsset.logoUrl}
      isFetched={isFetched}
    />
  );
};

export default StandardNetworkAccountAssets;
