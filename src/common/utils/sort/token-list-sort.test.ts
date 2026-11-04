import { GRC20InfoWithLogo } from "@/common/mapper/token/token-mapper";
import { formatUsdWhole } from "../price.utility";
import { applyLivePrices, getTokenMarketCap, sortTokensOnClient, toTokenListApiSortParams } from "./token-list-sort";

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
const symbols = (tokens: GRC20InfoWithLogo[]) => tokens.map(t => t.symbol);

describe("toTokenListApiSortParams", () => {
  it("sends only the holders sort to the API", () => {
    expect(toTokenListApiSortParams({ field: "holders", order: "asc" })).toEqual({ sort: "holders", order: "asc" });
    expect(toTokenListApiSortParams({ field: "marketCap", order: "desc" })).toEqual({});
    expect(toTokenListApiSortParams({ field: "holders", order: "none" })).toEqual({});
  });
});

describe("sortTokensOnClient", () => {
  it("sorts by market cap and keeps unpriced tokens last in both directions", () => {
    expect(symbols(sortTokensOnClient([A, B, C], { field: "marketCap", order: "desc" }))).toEqual(["B", "A", "C"]);
    expect(symbols(sortTokensOnClient([C, B, A], { field: "marketCap", order: "asc" }))).toEqual(["A", "B", "C"]);
  });

  it("applies decimals to the supply before pricing it", () => {
    const D = token("D", 2_000_000, 6, null, "1000"); // 2 tokens x 1000 = 2000
    const E = token("E", 2_000_000, 6, null, "100"); // 2 tokens x 100 = 200
    expect(symbols(sortTokensOnClient([E, A, D], { field: "marketCap", order: "desc" }))).toEqual(["D", "A", "E"]);
  });

  it("sorts by total supply in display units", () => {
    const D = token("D", 2_000_000, 6); // 2 after decimals
    expect(symbols(sortTokensOnClient([D, B, A], { field: "totalSupply", order: "desc" }))).toEqual(["A", "B", "D"]);
  });

  it("sorts by 24h transactions and keeps tokens without a count last", () => {
    const busy = token("BUSY", 1, 0, 75);
    const quiet = token("QUIET", 1, 0, 0);
    const unknown = token("UNKNOWN", 1);
    expect(symbols(sortTokensOnClient([unknown, quiet, busy], { field: "transfers24h", order: "desc" }))).toEqual([
      "BUSY",
      "QUIET",
      "UNKNOWN",
    ]);
    expect(symbols(sortTokensOnClient([unknown, busy, quiet], { field: "transfers24h", order: "asc" }))).toEqual([
      "QUIET",
      "BUSY",
      "UNKNOWN",
    ]);
  });

  it("keeps the server order for holders and unsorted lists", () => {
    expect(symbols(sortTokensOnClient([C, A, B], { field: "holders", order: "desc" }))).toEqual(["C", "A", "B"]);
    expect(symbols(sortTokensOnClient([C, A, B], { field: "marketCap", order: "none" }))).toEqual(["C", "A", "B"]);
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
