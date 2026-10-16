import { formatPoolFeePercent, gnoswapPoolUrl, gnoswapPositionUrl, parsePoolPath } from "./gnoswap-link.utility";

const POOL_PATH = "gno.land/r/gnoswap/gns.GNS:gno.land/r/gnoland/wugnot.wugnot:3000";

describe("gnoswapPoolUrl / gnoswapPositionUrl", () => {
  it("encodes the pool path into the gnoswap pool page URL", () => {
    expect(gnoswapPoolUrl(POOL_PATH)).toBe(`https://gnoswap.io/earn/pool?poolPath=${encodeURIComponent(POOL_PATH)}`);
  });

  it("focuses the pool page on a position and its holder", () => {
    expect(gnoswapPositionUrl(POOL_PATH, "1142", "g1holder")).toBe(`${gnoswapPoolUrl(POOL_PATH)}&addr=g1holder#1142`);
  });

  it("omits the holder when it is unknown", () => {
    expect(gnoswapPositionUrl(POOL_PATH, "1142")).toBe(`${gnoswapPoolUrl(POOL_PATH)}#1142`);
  });
});

describe("formatPoolFeePercent", () => {
  it("converts hundredths of a bip to a percent", () => {
    expect(formatPoolFeePercent(3000)).toBe("0.3%");
    expect(formatPoolFeePercent("500")).toBe("0.05%");
    expect(formatPoolFeePercent(10000)).toBe("1%");
  });
});

describe("parsePoolPath", () => {
  it("splits the on-chain pool path into its two tokens and fee", () => {
    expect(parsePoolPath(POOL_PATH)).toEqual({
      token0Path: "gno.land/r/gnoswap/gns.GNS",
      token1Path: "gno.land/r/gnoland/wugnot.wugnot",
      fee: "3000",
    });
  });

  it("rejects paths that are not token0:token1:fee", () => {
    expect(parsePoolPath("gno.land/r/gnoswap/gns.GNS")).toBeNull();
    expect(parsePoolPath("a:b")).toBeNull();
    expect(parsePoolPath("")).toBeNull();
  });
});
