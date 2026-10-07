import { splitAssetColumns } from "./account-assets.utility";

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
