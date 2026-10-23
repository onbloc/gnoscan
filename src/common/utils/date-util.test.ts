import { getDateDiff, getLocalDateString } from "./date-util";

describe("getLocalDateString", () => {
  it("does not invent a date for an absent update timestamp", () => {
    expect(getLocalDateString("")).toBe("-");
    expect(getLocalDateString(null)).toBe("-");
    expect(getLocalDateString(undefined)).toBe("-");
  });
});

describe("getDateDiff", () => {
  test("shows a time under a minute ago in short form", () => {
    expect(getDateDiff(new Date(Date.now() - 30 * 1000).toISOString())).toBe("≤ 1min");
    expect(getDateDiff(new Date(Date.now() - 5 * 60 * 1000).toISOString())).toBe("5 mins ago");
  });
});
