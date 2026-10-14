import { GRC20InfoWithLogo } from "@/common/mapper/token/token-mapper";
import { formatUsdWhole, TokenPriceEntry } from "../price.utility";
import { getTokenMarketCap, sortTokensOnClient, toTokenListApiSortParams } from "./token-list-sort";

const token = (
  symbol: string,
  totalSupply: number | string,
  decimals = 0,
  transactionCount24h: number | null = null,
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
});

// A has the larger supply, B the larger market cap, C has no price.
const A = token("A", 1000);
const B = token("B", 100);
const C = token("C", 500);
const prices: Record<string, TokenPriceEntry> = {
  "gno.land/r/demo/A.A": { price: "1" },
  "gno.land/r/demo/B.B": { price: "20" },
};
const getPriceEntry = (key: string) => prices[key] ?? null;
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
    expect(symbols(sortTokensOnClient([A, B, C], { field: "marketCap", order: "desc" }, getPriceEntry))).toEqual([
      "B",
      "A",
      "C",
    ]);
    expect(symbols(sortTokensOnClient([C, B, A], { field: "marketCap", order: "asc" }, getPriceEntry))).toEqual([
      "A",
      "B",
      "C",
    ]);
  });

  it("sorts by total supply in display units", () => {
    const D = token("D", 2_000_000, 6); // 2 after decimals
    expect(symbols(sortTokensOnClient([D, B, A], { field: "totalSupply", order: "desc" }, getPriceEntry))).toEqual([
      "A",
      "B",
      "D",
    ]);
  });

  it("sorts by 24h transactions and keeps tokens without a count last", () => {
    const busy = token("BUSY", 1, 0, 75);
    const quiet = token("QUIET", 1, 0, 0);
    const unknown = token("UNKNOWN", 1);
    expect(
      symbols(sortTokensOnClient([unknown, quiet, busy], { field: "transfers24h", order: "desc" }, getPriceEntry)),
    ).toEqual(["BUSY", "QUIET", "UNKNOWN"]);
    expect(
      symbols(sortTokensOnClient([unknown, busy, quiet], { field: "transfers24h", order: "asc" }, getPriceEntry)),
    ).toEqual(["QUIET", "BUSY", "UNKNOWN"]);
  });

  it("keeps the server order for holders and unsorted lists", () => {
    expect(symbols(sortTokensOnClient([C, A, B], { field: "holders", order: "desc" }, getPriceEntry))).toEqual([
      "C",
      "A",
      "B",
    ]);
    expect(symbols(sortTokensOnClient([C, A, B], { field: "marketCap", order: "none" }, getPriceEntry))).toEqual([
      "C",
      "A",
      "B",
    ]);
  });
});

describe("getTokenMarketCap", () => {
  it("keeps the exact raw supply past 2^53", () => {
    const D = token("D", "999999999999999999", 18);
    expect(formatUsdWhole(getTokenMarketCap(D, () => ({ price: "100" })))).toBe("$99");
  });
});
