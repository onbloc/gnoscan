import BigNumber from "bignumber.js";

import { formatTokenDecimal, isWugnotPackagePath } from "@/common/utils/token.utility";
import { WUGNOT_DISPLAY_DECIMALS } from "@/common/values/constant-value";
import { AccountAssetModel } from "@/repositories/api/account/response";
import { Amount } from "@/types/data-type";

// Highest amount first, across denoms - purely by numeric value, since each Amount's value is
// already in its own display units (decimal-shifted).
export function sortAmountsByValueDesc(amounts: Amount[]): Amount[] {
  return [...amounts].sort((a, b) => new BigNumber(b.value).comparedTo(new BigNumber(a.value)));
}

// GRC20 holdings only - the native GNOT balance is fetched separately (RPC) and combined by the caller.
export function mapAccountAssetsToAmounts(assets: AccountAssetModel[] | undefined): Amount[] {
  if (!assets) return [];

  return assets
    .filter(asset => asset.tokenType === "GRC20" && asset.name && asset.symbol)
    .map(asset => {
      // wugnot is on-chain with decimals: 0 and the backend reports it as-is, same override as resolveTokenMeta.
      const decimals = isWugnotPackagePath(asset.packagePath) ? WUGNOT_DISPLAY_DECIMALS : asset.decimals;
      return {
        value: formatTokenDecimal(asset.amount, decimals),
        denom: asset.symbol,
      };
    });
}
