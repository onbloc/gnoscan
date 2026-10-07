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
  it("keys gnoswap token paths by bare package path", () => {
    expect(buildTokenPriceMap([GNS])).toEqual({ "gno.land/r/gnoswap/gns": "0.0175" });
  });

  it("falls back to the wugnot price for ugnot", () => {
    expect(buildTokenPriceMap([WUGNOT]).ugnot).toBe("0.0699");
  });

  it("prefers the feed GNOT price over wugnot", () => {
    expect(buildTokenPriceMap([WUGNOT, FEED_GNOT]).ugnot).toBe("0.08");
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
    expect(buildTokenPriceMap([{ ...GNS, status: "stale" }])["gno.land/r/gnoswap/gns"]).toBe("0.0175");
  });

  it("keeps the first priced entry for a duplicated key", () => {
    expect(buildTokenPriceMap([GNS, { ...GNS, price: "9" }])["gno.land/r/gnoswap/gns"]).toBe("0.0175");
  });

  it("handles a missing list", () => {
    expect(buildTokenPriceMap(undefined)).toEqual({});
  });
});

describe("getTokenPrice", () => {
  const priceMap = buildTokenPriceMap([WUGNOT, GNS]);

  it("resolves package paths, token paths and helper-routed token keys", () => {
    expect(getTokenPrice(priceMap, "gno.land/r/gnoswap/gns")).toBe("0.0175");
    expect(getTokenPrice(priceMap, "gno.land/r/gnoswap/gns.GNS")).toBe("0.0175");
    expect(getTokenPrice(priceMap, "gno.land/r/gnoswap/gns.GNS.0000001")).toBe("0.0175");
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
  it("formats with two decimals and thousands separators", () => {
    expect(formatUsd("12.32")).toBe("$12.32");
    expect(formatUsd("1234567.8")).toBe("$1,234,567.80");
    expect(formatUsd(new BigNumber(3))).toBe("$3.00");
  });

  it("rounds down past two decimals", () => {
    expect(formatUsd("1.129")).toBe("$1.12");
  });

  it("shows sub-cent values as <$0.01 and zero as $0.00", () => {
    expect(formatUsd("0.009")).toBe("<$0.01");
    expect(formatUsd("0")).toBe("$0.00");
  });

  it("keeps the sign of negative values", () => {
    expect(formatUsd("-1.5")).toBe("-$1.50");
    expect(formatUsd("-0.001")).toBe("-<$0.01");
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
