import BigNumber from "bignumber.js";
import { toGNOT } from "./native-token-utility";

jest.mock("../hooks/common/use-token-meta", () => ({
  GNOTToken: {
    name: "Gno.land",
    denom: "ugnot",
    symbol: "GNOT",
    decimals: 6,
  },
}));

describe("toGNOT", () => {
  describe("when converting from ugnot", () => {
    it("should convert 1000000 ugnot to 1 GNOT", () => {
      expect(toGNOT("1000000", "ugnot")).toEqual({
        value: "1",
        denom: "GNOT",
      });
    });

    it("should convert 1 ugnot to 0.000001 GNOT", () => {
      expect(toGNOT("1", "ugnot")).toEqual({
        value: "0.000001",
        denom: "GNOT",
      });
    });

    it("should handle number type input", () => {
      expect(toGNOT(1000000, "ugnot")).toEqual({
        value: "1",
        denom: "GNOT",
      });
    });
  });

  describe("when converting from non-ugnot denomination", () => {
    it("should keep original value and uppercase the denom", () => {
      expect(toGNOT("100", "atom")).toEqual({
        value: "100",
        denom: "ATOM",
      });
    });

    it("should trim and uppercase denom", () => {
      expect(toGNOT("100", " atom ")).toEqual({
        value: "100",
        denom: "ATOM",
      });
    });
  });

  describe("when handling different cases of ugnot", () => {
    it("should handle uppercase UGNOT", () => {
      expect(toGNOT("1000000", "UGNOT")).toEqual({
        value: "1",
        denom: "GNOT",
      });
    });

    it("should handle mixed case UgNoT", () => {
      expect(toGNOT("1000000", "UgNoT")).toEqual({
        value: "1",
        denom: "GNOT",
      });
    });

    it("should handle with spaces", () => {
      expect(toGNOT("1000000", " ugnot ")).toEqual({
        value: "1",
        denom: "GNOT",
      });
    });
  });

  describe("edge cases", () => {
    it("should handle zero", () => {
      expect(toGNOT("0", "ugnot")).toEqual({
        value: "0",
        denom: "GNOT",
      });
      expect(toGNOT(0, "ugnot")).toEqual({
        value: "0",
        denom: "GNOT",
      });
    });

    it("should handle empty string value", () => {
      expect(toGNOT("", "ugnot")).toEqual({
        value: "0",
        denom: "GNOT",
      });
    });

    it("should handle very large numbers", () => {
      const largeNumber = "1000000000000000000000000";
      expect(toGNOT(largeNumber, "ugnot")).toEqual({
        value: new BigNumber(largeNumber).shiftedBy(-6).toString(),
        denom: "GNOT",
      });
    });

    it("should handle very small numbers", () => {
      expect(toGNOT("0.000001", "ugnot")).toEqual({
        value: Number("0.000000000001").toString(),
        denom: "GNOT",
      });
    });

    it("should handle scientific notation", () => {
      expect(toGNOT("1e6", "ugnot")).toEqual({
        value: "1",
        denom: "GNOT",
      });
    });

    it("should handle negative numbers", () => {
      expect(toGNOT("-1000000", "ugnot")).toEqual({
        value: "-1",
        denom: "GNOT",
      });
    });

    // null, undefined
    it("should handle null/undefined values", () => {
      // @ts-expect-error testing invalid denomination case
      expect(toGNOT(null, "ugnot")).toEqual({
        value: "0",
        denom: "GNOT",
      });

      // @ts-expect-error testing invalid value type
      expect(toGNOT(undefined, "ugnot")).toEqual({
        value: "0",
        denom: "GNOT",
      });
    });
  });
});
