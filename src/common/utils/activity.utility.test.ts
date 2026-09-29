import { isOnlyStorageEventsHidden, toDisplayAmount } from "./activity.utility";

describe("toDisplayAmount", () => {
  const amount = { denom: "gno.land/r/demo/bubble.BUBBLE.0000000", value: "1917948", decimals: 6, symbol: "BUBBLE" };

  it("falls back to the backend decimals and symbol", () => {
    expect(toDisplayAmount(amount)).toMatchObject({ value: "1.917948", denom: "BUBBLE" });
  });

  it("uses the resolved token meta when given", () => {
    expect(toDisplayAmount(amount, { symbol: "BBL", decimals: 3 })).toMatchObject({ value: "1917.948", denom: "BBL" });
  });
});

const base = {
  isFetched: true,
  totalEventCount: 10,
  visibleEventCount: 0,
  eventType: "",
  includeStorage: false,
};

describe("isOnlyStorageEventsHidden", () => {
  it("is true when the unfiltered list is empty but storage events exist", () => {
    expect(isOnlyStorageEventsHidden(base)).toBe(true);
  });

  it.each([
    ["the list is still loading", { isFetched: false }],
    ["storage events are already shown", { includeStorage: true }],
    ["an event type filter is applied", { eventType: "Transfer" }],
    ["non-storage events are visible", { visibleEventCount: 3 }],
    ["the realm has no events at all", { totalEventCount: 0 }],
    ["the total count is unknown", { totalEventCount: undefined }],
  ])("is false when %s", (_, override) => {
    expect(isOnlyStorageEventsHidden({ ...base, ...override })).toBe(false);
  });
});
