import { formatTokenDecimal } from "./token.utility";

describe("formatTokenDecimal", () => {
  describe("when handling valid number inputs", () => {
    test("should correctly format whole numbers", () => {
      // 1000000 / 10^6 = 1
      expect(formatTokenDecimal("1000000", 6)).toBe("1");
      expect(formatTokenDecimal(1000000, 6)).toBe("1");
    });

    test("should correctly format decimal numbers", () => {
      // 100000 / 10^6 = 0.1
      expect(formatTokenDecimal("100000", 6)).toBe("0.1");
      expect(formatTokenDecimal(100000, 6)).toBe("0.1");
    });

    test("should correctly format numbers with different decimal places", () => {
      // 1000000 / 10^4 = 100
      expect(formatTokenDecimal("1000000", 4)).toBe("100");
      expect(formatTokenDecimal(1000000, 4)).toBe("100");
    });

    test("should handle large numbers correctly", () => {
      // 1000000000000000000000000 / 10^6 = 1000000000000000000
      expect(formatTokenDecimal("1000000000000000000000000", 6)).toBe("1000000000000000000");
      expect(formatTokenDecimal(1000000000000000000000000, 6)).toBe("1000000000000000000");
    });
  });

  describe("when handling edge cases", () => {
    test("should handle null, undefined and empty string", () => {
      // @ts-expect-error null is not assignable to string | number
      expect(formatTokenDecimal(null)).toBe("0");
      // @ts-expect-error undefined is not assignable to string | number
      expect(formatTokenDecimal(undefined)).toBe("0");
      // @ts-expect-error "" is not assignable to string | number
      expect(formatTokenDecimal("")).toBe("0");
    });

    test("should handle edge cases for decimals parameter", () => {
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

    test("should handle zero values", () => {
      expect(formatTokenDecimal("0", 6)).toBe("0");
      expect(formatTokenDecimal(0, 6)).toBe("0");
    });

    test("should handle very small numbers", () => {
      expect(formatTokenDecimal("1", 6)).toBe("0.000001");
      expect(formatTokenDecimal(1, 6)).toBe("0.000001");
    });

    test("should handle invalid inputs", () => {
      expect(formatTokenDecimal("invalid", 6)).toBe("0");
      expect(formatTokenDecimal(NaN, 6)).toBe("0");
      expect(formatTokenDecimal(Infinity, 6)).toBe("0");
      expect(formatTokenDecimal("1,000,000", 6)).toBe("0");
    });

    test("should handle negative numbers", () => {
      expect(formatTokenDecimal("-1000000", 6)).toBe("-1");
      expect(formatTokenDecimal(-1000000, 6)).toBe("-1");

      expect(formatTokenDecimal("-100000", 6)).toBe("-0.1");
      expect(formatTokenDecimal(-100000, 6)).toBe("-0.1");
    });

    test("should handle whitespace in string inputs", () => {
      expect(formatTokenDecimal(" 1000000 ", 6)).toBe("1");
      expect(formatTokenDecimal("\t1000000\n", 6)).toBe("1");
      expect(formatTokenDecimal("   ", 6)).toBe("0");
    });

    test("should handle decimal inputs", () => {
      expect(formatTokenDecimal("1000000.0", 6)).toBe("1");
      expect(formatTokenDecimal("1000000.000", 6)).toBe("1");
      expect(formatTokenDecimal("1.5e6", 6)).toBe("1.5");
    });

    test("should handle extreme decimal places", () => {
      expect(formatTokenDecimal("1", 20)).toBe("0.00000000000000000001");
      expect(formatTokenDecimal("1", 0)).toBe("1");
    });
  });
});
