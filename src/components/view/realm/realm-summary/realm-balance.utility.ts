import { formatTokenDecimal } from "@/common/utils/token.utility";
import { AccountAssetModel } from "@/repositories/api/account/response";
import { Amount } from "@/types/data-type";

// GRC20 holdings only - the native GNOT balance is fetched separately (RPC) and prepended by the caller.
export function mapAccountAssetsToAmounts(assets: AccountAssetModel[] | undefined): Amount[] {
  if (!assets) return [];

  return assets
    .filter(asset => asset.tokenType === "GRC20" && asset.name && asset.symbol)
    .map(asset => ({
      value: formatTokenDecimal(asset.amount, asset.decimals),
      denom: asset.symbol,
    }));
}
