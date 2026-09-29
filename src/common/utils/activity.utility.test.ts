import { toDisplayAmount } from "./activity.utility";

describe("toDisplayAmount", () => {
  const amount = { denom: "gno.land/r/demo/bubble.BUBBLE.0000000", value: "1917948", decimals: 6, symbol: "BUBBLE" };

  it("falls back to the backend decimals and symbol", () => {
    expect(toDisplayAmount(amount)).toMatchObject({ value: "1.917948", denom: "BUBBLE" });
  });

  it("uses the resolved token meta when given", () => {
    expect(toDisplayAmount(amount, { symbol: "BBL", decimals: 3 })).toMatchObject({ value: "1917.948", denom: "BBL" });
  });
});
