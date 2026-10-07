import { AccountAssetModel } from "@/repositories/api/account/response";
import { isDisplayableAsset, splitAssetColumns } from "./account-assets.utility";

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

describe("splitAssetColumns", () => {
  it("returns empty columns for no assets", () => {
    expect(splitAssetColumns([])).toEqual([[], []]);
  });

  it("places the first asset beside the native token", () => {
    expect(splitAssetColumns(["a0"])).toEqual([[], ["a0"]]);
  });

  it("keeps the 2-column grid row order", () => {
    // Grid rows: [native, a0], [a1, a2], [a3, a4]
    expect(splitAssetColumns(["a0", "a1", "a2", "a3", "a4"])).toEqual([
      ["a1", "a3"],
      ["a0", "a2", "a4"],
    ]);
  });
});
