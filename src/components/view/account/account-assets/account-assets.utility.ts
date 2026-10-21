import BigNumber from "bignumber.js";

import { AccountAssetModel } from "@/repositories/api/account/response";

export const ASSET_GRID_GAP = 16;

// NFT holdings and zero-balance GRC20 assets are not shown in the token asset list.
export const isDisplayableAsset = (asset: AccountAssetModel) =>
  asset.tokenType === "GRC20" && !!asset.name && !!asset.symbol && !new BigNumber(asset.amount).isZero();

// Row-major placement in the 2-column desktop grid: [native, a0], [a1, a2], ...
export const getAssetGridColumn = (index: number) => (index % 2) + 1;

// Grid rows are 1px tall, so a cell spans its height plus the gap below it
export const getAssetGridRowSpan = (height: number) => Math.max(1, Math.ceil(height)) + ASSET_GRID_GAP;
