import BigNumber from "bignumber.js";

import { AssetPriceModel } from "@/repositories/api/price/response";
import { buildTokenPriceMap, formatTokenUsd, formatUsd, getTokenPrice, getUsdValue } from "./price.utility";

const asset = (overrides: Partial<AssetPriceModel>): AssetPriceModel => ({
  assetId: "",
  name: "",
  symbol: "",
  quoteCurrency: "USD",
  provider: "gnoswap",
  price: "",
  status: "fresh",
  priceAt: null,
  oneDayAgoPrice: null,
  oneDayAgoPriceAt: null,
  changeRateOneDay: null,
  providerAssetId: 0,
  ...overrides,
});

const WUGNOT = asset({ assetId: "gno.land/r/gnoland/wugnot.wugnot", price: "0.0699" });
const GNS = asset({ assetId: "gno.land/r/gnoswap/gns.GNS", price: "0.0175" });
const FEED_GNOT = asset({ assetId: "gno-land", provider: "coinmarketcap", price: "0.08" });

describe("buildTokenPriceMap", () => {
  it("falls back to the wugnot price for ugnot", () => {
    expect(getTokenPrice(buildTokenPriceMap([WUGNOT]), "ugnot")).toBe("0.0699");
  });

  it("prefers the feed GNOT price over wugnot", () => {
    expect(getTokenPrice(buildTokenPriceMap([WUGNOT, FEED_GNOT]), "ugnot")).toBe("0.08");
  });

  it("skips unavailable, empty, negative and non-numeric prices", () => {
    const priceMap = buildTokenPriceMap([
      asset({ assetId: "gno.land/r/a.A", price: "1", status: "unavailable" }),
      asset({ assetId: "gno.land/r/b.B", price: "" }),
      asset({ assetId: "gno.land/r/c.C", price: "-1" }),
      asset({ assetId: "gno.land/r/d.D", price: "abc" }),
    ]);
    expect(priceMap).toEqual({});
  });

  it("keeps stale prices", () => {
    expect(getTokenPrice(buildTokenPriceMap([{ ...GNS, status: "stale" }]), "gno.land/r/gnoswap/gns")).toBe("0.0175");
  });

  it("keeps the first priced entry for a duplicated key", () => {
    expect(getTokenPrice(buildTokenPriceMap([GNS, { ...GNS, price: "9" }]), "gno.land/r/gnoswap/gns.GNS")).toBe(
      "0.0175",
    );
  });

  it("handles a missing list", () => {
    expect(buildTokenPriceMap(undefined)).toEqual({});
  });
});

describe("getTokenPrice", () => {
  const priceMap = buildTokenPriceMap([WUGNOT, GNS]);

  it("resolves package paths, token paths and tokenIds", () => {
    expect(getTokenPrice(priceMap, "gno.land/r/gnoswap/gns")).toBe("0.0175");
    expect(getTokenPrice(priceMap, "gno.land/r/gnoswap/gns.GNS")).toBe("0.0175");
    expect(getTokenPrice(priceMap, "gno.land/r/gnoswap/gns.GNS.0000001")).toBe("0.0175");
    expect(getTokenPrice(priceMap, "gno.land/r/gnoland/wugnot.wugnot.0000000")).toBe("0.0699");
  });

  it("keeps tokens of a multi-token package apart", () => {
    const factoryMap = buildTokenPriceMap([
      asset({ assetId: "gno.land/r/demo/grc20factory.FOO", price: "1" }),
      asset({ assetId: "gno.land/r/demo/grc20factory.BAR", price: "2" }),
    ]);
    expect(getTokenPrice(factoryMap, "gno.land/r/demo/grc20factory.BAR.0000003")).toBe("2");
    expect(getTokenPrice(factoryMap, "gno.land/r/demo/grc20factory.BAZ")).toBeNull();
  });

  it("resolves ugnot case-insensitively", () => {
    expect(getTokenPrice(priceMap, " UGNOT ")).toBe("0.0699");
  });

  it("returns null for unpriced or empty keys", () => {
    expect(getTokenPrice(priceMap, "gno.land/r/demo/foo")).toBeNull();
    expect(getTokenPrice(priceMap, "")).toBeNull();
  });
});

describe("getUsdValue", () => {
  it("multiplies without float precision loss", () => {
    expect(getUsdValue("0.1", "0.2")?.toString()).toBe("0.02");
  });

  it("accepts comma-grouped amounts", () => {
    expect(getUsdValue("1,234.5", "2")?.toString()).toBe("2469");
  });

  it("handles amounts beyond the safe integer range", () => {
    expect(getUsdValue("123456789012345678901234567890", "1")?.toFixed()).toBe("123456789012345678901234567890");
  });

  it("returns null for invalid input", () => {
    expect(getUsdValue("abc", "1")).toBeNull();
    expect(getUsdValue("1", "")).toBeNull();
  });
});

describe("formatUsd", () => {
  it("truncates to two decimals with thousands separators from $1 up", () => {
    expect(formatUsd("12.32")).toBe("$12.32");
    expect(formatUsd("1.1295")).toBe("$1.12");
    expect(formatUsd("1.999")).toBe("$1.99");
    expect(formatUsd("1234.5678")).toBe("$1,234.56");
    expect(formatUsd("1234567.8")).toBe("$1,234,567.8");
  });

  it("truncates to three significant digits below $1", () => {
    expect(formatUsd("0.123456")).toBe("$0.123");
    expect(formatUsd("0.012349")).toBe("$0.0123");
    expect(formatUsd("0.0015")).toBe("$0.0015");
    expect(formatUsd("0.9999")).toBe("$0.999");
  });

  it("drops trailing zeros", () => {
    expect(formatUsd("0.5")).toBe("$0.5");
    expect(formatUsd("1.0004")).toBe("$1");
    expect(formatUsd(new BigNumber(3))).toBe("$3");
    expect(formatUsd("0")).toBe("$0");
  });

  it("shows the $0.001 floor for values above zero but below it", () => {
    expect(formatUsd("0.001")).toBe("$0.001");
    expect(formatUsd("0.0009999")).toBe("<\u00A0$0.001");
    expect(formatUsd("0.00000001")).toBe("<\u00A0$0.001");
  });

  it("returns null for missing or invalid values", () => {
    expect(formatUsd(null)).toBeNull();
    expect(formatUsd(undefined)).toBeNull();
    expect(formatUsd("abc")).toBeNull();
    expect(formatUsd(Infinity)).toBeNull();
  });
});

describe("formatTokenUsd", () => {
  const priceMap = buildTokenPriceMap([WUGNOT]);

  it("formats a priced token amount", () => {
    // 512.12 * 0.0699 = 35.797188
    expect(formatTokenUsd(priceMap, "ugnot", "512.12")).toBe("$35.79");
  });

  it("returns null for an unpriced token", () => {
    expect(formatTokenUsd(priceMap, "gno.land/r/demo/foo", "1")).toBeNull();
  });
});
