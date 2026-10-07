import { AccountAssetModel } from "@/repositories/api/account/response";

// GRC721 (NFT) holdings are not shown in the token asset list yet
export const isDisplayableAsset = (asset: AccountAssetModel) =>
  asset.tokenType !== "GRC721" && !!asset.name && !!asset.symbol;

// Splits GRC20 assets into two desktop columns, matching the row-major order of
// a 2-column grid whose first cell is the native token: [native, a0], [a1, a2], ...
export function splitAssetColumns<T>(assets: T[]): [T[], T[]] {
  const left: T[] = [];
  const right: T[] = [];

  assets.forEach((asset, index) => (index % 2 === 0 ? right : left).push(asset));

  return [left, right];
}
