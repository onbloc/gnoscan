import { formatTokenDecimal, isWugnotPackagePath } from "@/common/utils/token.utility";
import { WUGNOT_DISPLAY_DECIMALS } from "@/common/values/constant-value";
import { AccountAssetModel } from "@/repositories/api/account/response";
import { Amount } from "@/types/data-type";

// GRC20 holdings only - the native GNOT balance is fetched separately (RPC) and prepended by the caller.
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
