import { AccountAssetModel } from "@/repositories/api/account/response";
import { ASSET_GRID_GAP, getAssetGridColumn, getAssetGridRowSpan, isDisplayableAsset } from "./account-assets.utility";

const asset = (overrides: Partial<AccountAssetModel>) =>
  ({ tokenType: "GRC20", name: "Gnoswap", symbol: "GNS", ...overrides } as AccountAssetModel);

describe("isDisplayableAsset", () => {
  it("shows named GRC20 tokens", () => {
    expect(isDisplayableAsset(asset({}))).toBe(true);
  });

  it("hides GRC721 (NFT) holdings", () => {
    expect(isDisplayableAsset(asset({ tokenType: "GRC721", name: "GNOSWAP NFT", symbol: "GNFT" }))).toBe(false);
  });

  it("hides assets without name or symbol", () => {
    expect(isDisplayableAsset(asset({ name: "" }))).toBe(false);
    expect(isDisplayableAsset(asset({ symbol: "" }))).toBe(false);
  });
});

describe("getAssetGridColumn", () => {
  it("alternates columns in row-major order", () => {
    // Grid rows: [native, a0], [a1, a2]
    expect([0, 1, 2, 3].map(getAssetGridColumn)).toEqual([1, 2, 1, 2]);
  });
});

describe("getAssetGridRowSpan", () => {
  it("spans the rounded-up height plus the gap", () => {
    expect(getAssetGridRowSpan(72)).toBe(72 + ASSET_GRID_GAP);
    expect(getAssetGridRowSpan(72.2)).toBe(73 + ASSET_GRID_GAP);
  });

  it("spans at least one row for empty cells", () => {
    expect(getAssetGridRowSpan(0)).toBe(1 + ASSET_GRID_GAP);
  });
});
