import { formatDisplayBlockHeight } from "./block.utility";
import { GNO_BLOCK_CONSTANTS } from "../values/gno.constant";

describe("formatDisplayBlockHeight", () => {
  it("should return '-' when value is null", () => {
    expect(formatDisplayBlockHeight(null)).toBe("-");
    expect(formatDisplayBlockHeight(undefined)).toBe("-");
    expect(formatDisplayBlockHeight("")).toBe("-");
  });

  it("should return GENESIS constant when value is '0'", () => {
    expect(formatDisplayBlockHeight("0")).toBe(GNO_BLOCK_CONSTANTS.GENESIS);
    expect(formatDisplayBlockHeight(0)).toBe(GNO_BLOCK_CONSTANTS.GENESIS);
  });

  it("should return original value for non-null and non-zero values", () => {
    expect(formatDisplayBlockHeight("123")).toBe("123");
    expect(formatDisplayBlockHeight("456789")).toBe("456789");

    expect(formatDisplayBlockHeight(123)).toBe("123");
    expect(formatDisplayBlockHeight(456789)).toBe("456789");
    expect(formatDisplayBlockHeight("456789a")).toBe("-");
  });
});
