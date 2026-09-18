import { AccountAssetModel } from "@/repositories/api/account/response";

import { mapAccountAssetsToAmounts } from "./realm-balance.utility";

function makeAsset(overrides: Partial<AccountAssetModel> = {}): AccountAssetModel {
  return {
    address: "g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5",
    tokenType: "GRC20",
    tokenId: "1",
    slug: "gns",
    packagePath: "gno.land/r/demo/gns",
    amount: "10550316077354",
    name: "Gnoswap",
    symbol: "GNS",
    decimals: 6,
    logoUrl: "",
    ...overrides,
  };
}

describe("mapAccountAssetsToAmounts", () => {
  test("shifts the raw amount by decimals and keeps the symbol as-is", () => {
    const result = mapAccountAssetsToAmounts([makeAsset()]);

    expect(result).toEqual([{ value: "10550316.077354", denom: "GNS" }]);
  });

  test("filters out native entries and assets missing name/symbol", () => {
    const result = mapAccountAssetsToAmounts([
      makeAsset({ tokenType: "Native" }),
      makeAsset({ name: "" }),
      makeAsset({ symbol: "" }),
    ]);

    expect(result).toEqual([]);
  });

  test("returns an empty list when assets is undefined", () => {
    expect(mapAccountAssetsToAmounts(undefined)).toEqual([]);
  });
});
