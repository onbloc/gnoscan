import { formatTokenDecimal, formatDisplayTokenPath, resolveTokenMeta, isWugnotPackagePath } from "./token.utility";

describe("formatTokenDecimal", () => {
  describe("when handling valid number inputs", () => {
    it("should correctly format whole numbers", () => {
      // 1000000 / 10^6 = 1
      expect(formatTokenDecimal("1000000", 6)).toBe("1");
      expect(formatTokenDecimal(1000000, 6)).toBe("1");
    });

    it("should correctly format decimal numbers", () => {
      // 100000 / 10^6 = 0.1
      expect(formatTokenDecimal("100000", 6)).toBe("0.1");
      expect(formatTokenDecimal(100000, 6)).toBe("0.1");
    });

    it("should correctly format numbers with different decimal places", () => {
      // 1000000 / 10^4 = 100
      expect(formatTokenDecimal("1000000", 4)).toBe("100");
      expect(formatTokenDecimal(1000000, 4)).toBe("100");
    });

    it("should handle large numbers correctly", () => {
      // 1000000000000000000000000 / 10^6 = 1000000000000000000
      expect(formatTokenDecimal("1000000000000000000000000", 6)).toBe("1000000000000000000");
      expect(formatTokenDecimal(1000000000000000000000000, 6)).toBe("1000000000000000000");
    });
  });

  describe("when handling edge cases", () => {
    it("should handle null, undefined and empty string", () => {
      // @ts-expect-error null is not assignable to string | number
      expect(formatTokenDecimal(null)).toBe("0");
      // @ts-expect-error undefined is not assignable to string | number
      expect(formatTokenDecimal(undefined)).toBe("0");
      // @ts-expect-error "" is not assignable to string | number
      expect(formatTokenDecimal("")).toBe("0");
    });

    it("should handle edge cases for decimals parameter", () => {
      // @ts-expect-error undefined is not assignable to string | number
      expect(formatTokenDecimal("1000000", undefined)).toBe("1000000");

      // @ts-expect-error null is not assignable to number
      expect(formatTokenDecimal("1000000", null)).toBe("1000000");

      // @ts-expect-error empty string is not assignable to number
      expect(formatTokenDecimal("1000000", "")).toBe("1000000");

      // @ts-expect-error invalid string is not assignable to number
      expect(formatTokenDecimal("1000000", "invalid")).toBe("1000000");

      // @ts-expect-error string is not assignable to number
      expect(formatTokenDecimal("1000000", "6")).toBe("1");
    });

    it("should handle zero values", () => {
      expect(formatTokenDecimal("0", 6)).toBe("0");
      expect(formatTokenDecimal(0, 6)).toBe("0");
    });

    it("should handle very small numbers", () => {
      expect(formatTokenDecimal("1", 6)).toBe("0.000001");
      expect(formatTokenDecimal(1, 6)).toBe("0.000001");
    });

    it("should handle invalid inputs", () => {
      expect(formatTokenDecimal("invalid", 6)).toBe("0");
      expect(formatTokenDecimal(NaN, 6)).toBe("0");
      expect(formatTokenDecimal(Infinity, 6)).toBe("0");
      expect(formatTokenDecimal("1,000,000", 6)).toBe("0");
    });

    it("should handle negative numbers", () => {
      expect(formatTokenDecimal("-1000000", 6)).toBe("-1");
      expect(formatTokenDecimal(-1000000, 6)).toBe("-1");

      expect(formatTokenDecimal("-100000", 6)).toBe("-0.1");
      expect(formatTokenDecimal(-100000, 6)).toBe("-0.1");
    });

    it("should handle whitespace in string inputs", () => {
      expect(formatTokenDecimal(" 1000000 ", 6)).toBe("1");
      expect(formatTokenDecimal("\t1000000\n", 6)).toBe("1");
      expect(formatTokenDecimal("   ", 6)).toBe("0");
    });

    it("should handle decimal inputs", () => {
      expect(formatTokenDecimal("1000000.0", 6)).toBe("1");
      expect(formatTokenDecimal("1000000.000", 6)).toBe("1");
      expect(formatTokenDecimal("1.5e6", 6)).toBe("1.5");
    });

    it("should handle extreme decimal places", () => {
      expect(formatTokenDecimal("1", 20)).toBe("0.00000000000000000001");
      expect(formatTokenDecimal("1", 0)).toBe("1");
    });
  });
});

describe("formatDisplayTokenPath", () => {
  describe("Normal Cases", () => {
    it("should format path with default visibleLength (8)", () => {
      const input = "/r/g1edq4dugw0sgat4zxcw9xardvuydqf6cgleuc8p/USDC";
      const expected = "/r/g1edq4du...cgleuc8p/USDC";
      expect(formatDisplayTokenPath(input)).toBe(expected);
    });

    it("should format path with custom visibleLength", () => {
      const input = "/r/g1edq4dugw0sgat4zxcw9xardvuydqf6cgleuc8p/USDC";
      const expected = "/r/g1ed...uc8p/USDC";
      expect(formatDisplayTokenPath(input, 4)).toBe(expected);
    });
  });

  describe("Edge Cases", () => {
    it("should return original path for null input", () => {
      const input = null;
      // @ts-expect-error formatDisplayTokenPath expects string type
      expect(formatDisplayTokenPath(input)).toBe(input);
    });

    it("should return original path for undefined input", () => {
      const input = undefined;
      // @ts-expect-error formatDisplayTokenPath expects string type
      expect(formatDisplayTokenPath(input)).toBe(input);
    });

    it("should return original path for non-string input", () => {
      const input = 123;
      // @ts-expect-error formatDisplayTokenPath expects string type
      expect(formatDisplayTokenPath(input)).toBe(input);
    });
  });

  describe("Invalid Format Cases", () => {
    it("should return original path when not starting with /r/", () => {
      const input = "wrong/path/format";
      expect(formatDisplayTokenPath(input)).toBe(input);
    });

    it("should return original path when missing token name", () => {
      const input = "/r/g1jg2mtutu9khhfwc4nxmuhcpftf0pajfja1azs1";
      expect(formatDisplayTokenPath(input)).toBe(input);
    });

    it("should return original path for malformed input", () => {
      const input = "/r//USDC";
      expect(formatDisplayTokenPath(input)).toBe(input);
    });
  });

  describe("Boundary Value Tests", () => {
    it("should handle empty string input", () => {
      expect(formatDisplayTokenPath("")).toBe("");
    });

    it("should handle path with minimum valid format", () => {
      const input = "/r/a/b";
      expect(formatDisplayTokenPath(input)).toBe(input);
    });

    it("should handle path with exactly twice the visibleLength", () => {
      const input = "/r/1234567890123456/TOKEN";
      expect(formatDisplayTokenPath(input, 8)).toBe(input);
    });
  });

  describe("Various VisibleLength Tests", () => {
    const input = "/r/g1jg2mtutu9khhfwc4nxmuhcpftf0pajfja1azs1/USDC";

    it("should handle zero visibleLength", () => {
      expect(formatDisplayTokenPath(input, 0)).toBe(input);
    });

    it("should handle negative visibleLength", () => {
      expect(formatDisplayTokenPath(input, -1)).toBe(input);
    });

    it("should handle large visibleLength", () => {
      expect(formatDisplayTokenPath(input, 20)).toBe(input);
    });

    it("should handle visibleLength larger than address length", () => {
      expect(formatDisplayTokenPath(input, 100)).toBe(input);
    });
  });
});

describe("resolveTokenMeta", () => {
  const fallback = { name: "Backend Name", symbol: "BKD", decimals: 6, image: "backend.png" };

  it("uses the resource entry (all fields) when the token key matches directly", () => {
    const resourceMap = {
      "gno.land/r/demo/token": { name: "Resource Name", symbol: "RSRC", decimals: 4, image: "resource.png" },
    };

    const result = resolveTokenMeta(resourceMap, "gno.land/r/demo/token", fallback);

    expect(result).toEqual({ name: "Resource Name", symbol: "RSRC", decimals: 4, image: "resource.png" });
  });

  it("matches after stripping a registry-symbol/tokenId suffix from the key", () => {
    const resourceMap = {
      "gno.land/r/demo/token": { name: "Resource Name", symbol: "RSRC", decimals: 4, image: "resource.png" },
    };

    const result = resolveTokenMeta(resourceMap, "gno.land/r/demo/token.RSRC.0000001", fallback);

    expect(result.name).toBe("Resource Name");
  });

  it("falls back entirely to the caller's data when there's no resource entry", () => {
    const result = resolveTokenMeta({}, "gno.land/r/unknown/token", fallback);

    expect(result).toEqual(fallback);
  });

  it("falls back to the caller's image when the resource entry has none", () => {
    const resourceMap = {
      "gno.land/r/demo/token": { name: "Resource Name", symbol: "RSRC", decimals: 4, image: undefined },
    };

    const result = resolveTokenMeta(resourceMap, "gno.land/r/demo/token", fallback);

    expect(result.image).toBe("backend.png");
  });

  it("never mixes fields from both sources - it's resource-all or fallback-all", () => {
    const resourceMap = {
      "gno.land/r/demo/token": { name: "Resource Name", symbol: "RSRC", decimals: 4, image: "resource.png" },
    };

    const hit = resolveTokenMeta(resourceMap, "gno.land/r/demo/token", fallback);
    const miss = resolveTokenMeta(resourceMap, "gno.land/r/other/token", fallback);

    expect(hit.decimals).toBe(4);
    expect(miss).toEqual(fallback);
  });

  it("overrides wugnot decimals to 6 even when the resource entry (also wrong) reports 0", () => {
    const resourceMap = {
      "gno.land/r/gnoland/wugnot": { name: "wrapped GNOT", symbol: "wugnot", decimals: 0, image: "wugnot.png" },
    };

    const result = resolveTokenMeta(resourceMap, "gno.land/r/gnoland/wugnot", fallback);

    expect(result.decimals).toBe(6);
    // Only decimals is hardcoded - name/symbol/image still come from the resource entry.
    expect(result.name).toBe("wrapped GNOT");
    expect(result.symbol).toBe("wugnot");
  });

  it("overrides wugnot decimals to 6 even with no resource entry at all (backend-only fallback)", () => {
    const backendFallback = { name: "wrapped GNOT", symbol: "wugnot", decimals: 0, image: undefined };

    const result = resolveTokenMeta({}, "gno.land/r/gnoland/wugnot.wugnot.0000001", backendFallback);

    expect(result.decimals).toBe(6);
  });

  it("does not touch decimals for a different token, even one that also happens to report 0", () => {
    const result = resolveTokenMeta({}, "gno.land/r/other/token", { ...fallback, decimals: 0 });

    expect(result.decimals).toBe(0);
  });
});

describe("isWugnotPackagePath", () => {
  it("matches the bare wugnot package path", () => {
    expect(isWugnotPackagePath("gno.land/r/gnoland/wugnot")).toBe(true);
  });

  it("matches a registry-keyed wugnot denom (packagePath.symbol)", () => {
    expect(isWugnotPackagePath("gno.land/r/gnoland/wugnot.wugnot")).toBe(true);
  });

  it("matches a helper-routed wugnot denom with a numeric tokenId suffix", () => {
    expect(isWugnotPackagePath("gno.land/r/gnoland/wugnot.wugnot.1234567")).toBe(true);
  });

  it("does not match a different token", () => {
    expect(isWugnotPackagePath("gno.land/r/gnoswap/gns.GNS")).toBe(false);
  });
});
