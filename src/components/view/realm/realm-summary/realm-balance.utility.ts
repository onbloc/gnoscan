import BigNumber from "bignumber.js";

import {
  formatTokenDecimal,
  resolveTokenMeta,
  ResolvedTokenMeta,
  TokenMetaFallback,
} from "@/common/utils/token.utility";
import { AccountAssetModel } from "@/repositories/api/account/response";
import { isDisplayableAsset } from "@/components/view/account/account-assets/account-assets.utility";
import { Amount } from "@/types/data-type";

// Amount plus the token key (denom/path) it came from, for price lookups.
export type TokenAmount = Amount & { tokenKey: string };

// Highest amount first, across denoms - purely by numeric value, since each Amount's value is
// already in its own display units (decimal-shifted).
export function sortAmountsByValueDesc<T extends Amount>(amounts: T[]): T[] {
  return [...amounts].sort((a, b) => new BigNumber(b.value).comparedTo(new BigNumber(a.value)));
}

type TokenMetaResolver = (tokenKey: string, fallback: TokenMetaFallback) => ResolvedTokenMeta;

// Without the resource list, the backend values are used (plus resolveTokenMeta's wugnot override).
const resolveWithoutResource: TokenMetaResolver = (tokenKey, fallback) => resolveTokenMeta({}, tokenKey, fallback);

// Non-zero GRC20 holdings only - the native GNOT balance is fetched separately (RPC) and combined by the caller.
// Pass useTokenResourceMeta().getTokenMeta so the token resource list wins over the backend values.
export function mapAccountAssetsToAmounts(
  assets: AccountAssetModel[] | undefined,
  getTokenMeta: TokenMetaResolver = resolveWithoutResource,
): TokenAmount[] {
  if (!assets) return [];

  return assets.filter(isDisplayableAsset).map(asset => {
    const tokenKey = asset.tokenId || asset.packagePath;
    const resolved = getTokenMeta(tokenKey, {
      name: asset.name,
      symbol: asset.symbol,
      decimals: asset.decimals,
    });
    return {
      value: formatTokenDecimal(asset.amount, resolved.decimals),
      denom: resolved.symbol || asset.symbol,
      tokenKey,
    };
  });
}
