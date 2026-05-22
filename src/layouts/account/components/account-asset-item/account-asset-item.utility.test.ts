import { resolveAccountAssetLogoUrl } from "./account-asset-item.utility";

describe("resolveAccountAssetLogoUrl", () => {
  it("should prefer the explicit logo URL", () => {
    const getTokenImage = jest.fn(() => "https://resource.example/ugnot.svg");

    expect(resolveAccountAssetLogoUrl("https://api.example/token.svg", "ugnot", getTokenImage)).toBe(
      "https://api.example/token.svg",
    );
    expect(getTokenImage).not.toHaveBeenCalled();
  });

  it("should fall back to the token resource image", () => {
    const getTokenImage = jest.fn(() => "https://resource.example/ugnot.svg");

    expect(resolveAccountAssetLogoUrl("", "ugnot", getTokenImage)).toBe("https://resource.example/ugnot.svg");
    expect(getTokenImage).toHaveBeenCalledWith("ugnot");
  });

  it("should return an empty string when no logo source exists", () => {
    const getTokenImage = jest.fn(() => undefined);

    expect(resolveAccountAssetLogoUrl(null, "unknown", getTokenImage)).toBe("");
  });
});
