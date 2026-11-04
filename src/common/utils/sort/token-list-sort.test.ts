import { GRC20InfoWithLogo } from "@/common/mapper/token/token-mapper";
import { formatUsdWhole } from "../price.utility";
import { applyLivePrices, getTokenMarketCap, toTokenListApiSortParams } from "./token-list-sort";

const token = (
  symbol: string,
  totalSupply: number | string,
  decimals = 0,
  transactionCount24h: number | null = null,
  price: string | null = null,
): GRC20InfoWithLogo => ({
  tokenId: `gno.land/r/demo/${symbol}.${symbol}`,
  slug: symbol,
  packagePath: `gno.land/r/demo/${symbol}`,
  owner: "",
  name: symbol,
  symbol,
  decimals,
  functions: [],
  totalSupply: String(totalSupply),
  holders: 0,
  logoUrl: "",
  registered: true,
  transactionCount24h,
  createdAt: null,
  createdTransactionHash: null,
  price,
  changeRateOneDay: null,
});

// A has the larger supply, B the larger market cap, C has no price.
const A = token("A", 1000, 0, null, "1");
const B = token("B", 100, 0, null, "20");
const C = token("C", 500);

describe("toTokenListApiSortParams", () => {
  it("sends every sortable column to the API", () => {
    expect(toTokenListApiSortParams({ field: "holders", order: "asc" })).toEqual({ sort: "holders", order: "asc" });
    expect(toTokenListApiSortParams({ field: "marketCap", order: "desc" })).toEqual({
      sort: "marketCap",
      order: "desc",
    });
    expect(toTokenListApiSortParams({ field: "totalSupply", order: "asc" })).toEqual({
      sort: "totalSupply",
      order: "asc",
    });
    expect(toTokenListApiSortParams({ field: "transfers24h", order: "desc" })).toEqual({
      sort: "transfers24h",
      order: "desc",
    });
  });

  it("sends no sort when unsorted", () => {
    expect(toTokenListApiSortParams({ field: "holders", order: "none" })).toEqual({});
    expect(toTokenListApiSortParams({ field: "none", order: "desc" })).toEqual({});
  });
});

describe("getTokenMarketCap", () => {
  it("keeps the exact raw supply past 2^53", () => {
    const D = token("D", "999999999999999999", 18, null, "100");
    expect(formatUsdWhole(getTokenMarketCap(D))).toBe("$99");
  });

  it("is null for a token without a price", () => {
    expect(getTokenMarketCap(C)).toBeNull();
  });
});

describe("applyLivePrices", () => {
  const live: Record<string, { price: string; changeRateOneDay?: number | null }> = {
    "gno.land/r/demo/A.A": { price: "5", changeRateOneDay: 1.5 },
    "gno.land/r/demo/C.C": { price: "7" },
  };
  const lookup = (key: string) => live[key] ?? null;

  it("overlays the polled price and change rate, and fills a token the API did not price", () => {
    const [a, b, c] = applyLivePrices([A, B, C], lookup);
    expect(a).toMatchObject({ price: "5", changeRateOneDay: 1.5 });
    expect(c).toMatchObject({ price: "7", changeRateOneDay: null });
    expect(getTokenMarketCap(c)?.toString()).toBe("3500");
    expect(b).toBe(B);
  });

  it("does not change the token rows without an entry", () => {
    expect(applyLivePrices([A, B], () => null)).toEqual([A, B]);
  });
});
