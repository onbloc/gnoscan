import { Amount } from "@/types";
import { AmountUtils } from "./amount.utility";

describe("AmountUtils", () => {
  describe("isValid", () => {
    it("should return true for valid Amount objects", () => {
      const validAmount: Amount = { value: "100", denom: "ugnot" };
      expect(AmountUtils.isValid(validAmount)).toBe(true);
    });

    it("should return false for null or undefined", () => {
      expect(AmountUtils.isValid(null)).toBe(false);
      expect(AmountUtils.isValid(undefined)).toBe(false);
    });

    it("should return false for invalid Amount objects", () => {
      const invalidAmount1 = { value: 100, denom: "token" };
      const invalidAmount2 = { value: "100" };
      const invalidAmount3 = { denom: "token" };

      /* eslint-disable @typescript-eslint/no-explicit-any */
      expect(AmountUtils.isValid(invalidAmount1 as any)).toBe(false);
      expect(AmountUtils.isValid(invalidAmount2 as any)).toBe(false);
      expect(AmountUtils.isValid(invalidAmount3 as any)).toBe(false);
    });
  });

  describe("zero", () => {
    it("should create a zero Amount with specified denom", () => {
      const result = AmountUtils.zero("token");
      expect(result).toEqual({ value: "0", denom: "token" });
    });

    it("should create a zero Amount with empty denom when not specified", () => {
      const result = AmountUtils.zero();
      expect(result).toEqual({ value: "0", denom: "" });
    });
  });

  describe("checkSameDenom", () => {
    it("should not throw error when denoms are the same", () => {
      const a: Amount = { value: "100", denom: "token" };
      const b: Amount = { value: "200", denom: "token" };

      expect(() => AmountUtils.checkSameDenom(a, b, "test")).not.toThrow();
    });

    it("should throw error when denoms are different", () => {
      const a: Amount = { value: "100", denom: "tokenA" };
      const b: Amount = { value: "200", denom: "tokenB" };

      expect(() => AmountUtils.checkSameDenom(a, b, "test")).toThrow(
        "Cannot test amounts with different denoms: tokenA and tokenB",
      );
    });
  });

  describe("add", () => {
    it("should add two valid Amount objects with the same denom", () => {
      const a: Amount = { value: "100", denom: "token" };
      const b: Amount = { value: "200", denom: "token" };

      const result = AmountUtils.add(a, b);
      expect(result).toEqual({ value: "300", denom: "token" });
    });

    it("should handle negative values correctly", () => {
      const a: Amount = { value: "100", denom: "token" };
      const b: Amount = { value: "-50", denom: "token" };

      const result = AmountUtils.add(a, b);
      expect(result).toEqual({ value: "50", denom: "token" });
    });

    it("should return a zero Amount when both inputs are invalid", () => {
      const result = AmountUtils.add(null, undefined);
      expect(result).toEqual({ value: "0", denom: "" });
    });

    it("should return the first Amount when the second is invalid", () => {
      const a: Amount = { value: "100", denom: "token" };

      const result = AmountUtils.add(a, null);
      expect(result).toEqual(a);
    });

    it("should return the second Amount when the first is invalid", () => {
      const b: Amount = { value: "200", denom: "token" };

      const result = AmountUtils.add(null, b);
      expect(result).toEqual(b);
    });

    it("should throw error when denoms are different", () => {
      const a: Amount = { value: "100", denom: "tokenA" };
      const b: Amount = { value: "200", denom: "tokenB" };

      expect(() => AmountUtils.add(a, b)).toThrow("Cannot add amounts with different denoms: tokenA and tokenB");
    });
  });

  describe("subtract", () => {
    it("should subtract the second Amount from the first Amount", () => {
      const a: Amount = { value: "300", denom: "token" };
      const b: Amount = { value: "100", denom: "token" };

      const result = AmountUtils.subtract(a, b);
      expect(result).toEqual({ value: "200", denom: "token" });
    });

    it("should handle negative results correctly", () => {
      const a: Amount = { value: "100", denom: "token" };
      const b: Amount = { value: "200", denom: "token" };

      const result = AmountUtils.subtract(a, b);
      expect(result).toEqual({ value: "-100", denom: "token" });
    });

    it("should return a zero Amount when both inputs are invalid", () => {
      const result = AmountUtils.subtract(null, undefined);
      expect(result).toEqual({ value: "0", denom: "" });
    });

    it("should return the first Amount when the second is invalid", () => {
      const a: Amount = { value: "100", denom: "token" };

      const result = AmountUtils.subtract(a, null);
      expect(result).toEqual(a);
    });

    it("should return the negated second Amount when the first is invalid", () => {
      const b: Amount = { value: "200", denom: "token" };

      const result = AmountUtils.subtract(null, b);
      expect(result).toEqual({ value: "-200", denom: "token" });
    });

    it("should throw error when denoms are different", () => {
      const a: Amount = { value: "100", denom: "tokenA" };
      const b: Amount = { value: "200", denom: "tokenB" };

      expect(() => AmountUtils.subtract(a, b)).toThrow(
        "Cannot subtract amounts with different denoms: tokenA and tokenB",
      );
    });
  });
});
