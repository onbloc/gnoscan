import { splitChange } from "./balance-change.utility";

describe("splitChange", () => {
  it("takes a gain as In and a loss as Out, without its sign", () => {
    expect(splitChange("1500000")).toEqual({ in: "1500000", out: "0" });
    expect(splitChange("-1500000")).toEqual({ in: "0", out: "1500000" });
  });

  it("splits amounts beyond 64 bits and beyond 2^53 exactly, in plain digits", () => {
    expect(splitChange("-18446744073709552106")).toEqual({ in: "0", out: "18446744073709552106" });
    expect(splitChange("9007199254740993")).toEqual({ in: "9007199254740993", out: "0" });
    expect(splitChange("100000000000000000000000000000")).toEqual({ in: "100000000000000000000000000000", out: "0" });
  });

  it("gives neither side for no change or for something that is not a number", () => {
    expect(splitChange("0")).toEqual({ in: "0", out: "0" });
    expect(splitChange("")).toEqual({ in: "0", out: "0" });
  });
});
