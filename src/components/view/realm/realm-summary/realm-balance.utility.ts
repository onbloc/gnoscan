import BigNumber from "bignumber.js";

import {
  formatTokenDecimal,
  resolveTokenMeta,
  ResolvedTokenMeta,
  TokenMetaFallback,
} from "@/common/utils/token.utility";
import { AccountAssetModel } from "@/repositories/api/account/response";
import { Amount } from "@/types/data-type";

// Highest amount first, across denoms - purely by numeric value, since each Amount's value is
// already in its own display units (decimal-shifted).
export function sortAmountsByValueDesc(amounts: Amount[]): Amount[] {
  return [...amounts].sort((a, b) => new BigNumber(b.value).comparedTo(new BigNumber(a.value)));
}

type TokenMetaResolver = (tokenKey: string, fallback: TokenMetaFallback) => ResolvedTokenMeta;

// Without the resource list, the backend values are used (plus resolveTokenMeta's wugnot override).
const resolveWithoutResource: TokenMetaResolver = (tokenKey, fallback) => resolveTokenMeta({}, tokenKey, fallback);

// GRC20 holdings only - the native GNOT balance is fetched separately (RPC) and combined by the caller.
// Pass useTokenResourceMeta().getTokenMeta so the token resource list wins over the backend values.
export function mapAccountAssetsToAmounts(
  assets: AccountAssetModel[] | undefined,
  getTokenMeta: TokenMetaResolver = resolveWithoutResource,
): Amount[] {
  if (!assets) return [];

  return assets
    .filter(asset => asset.tokenType === "GRC20" && asset.name && asset.symbol)
    .map(asset => {
      const resolved = getTokenMeta(asset.tokenId || asset.packagePath, {
        name: asset.name,
        symbol: asset.symbol,
        decimals: asset.decimals,
      });
      return {
        value: formatTokenDecimal(asset.amount, resolved.decimals),
        denom: resolved.symbol || asset.symbol,
      };
    });
}
