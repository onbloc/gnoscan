import { getLocalDateString } from "./date-util";

describe("getLocalDateString", () => {
  it("does not invent a date for an absent update timestamp", () => {
    expect(getLocalDateString("")).toBe("-");
    expect(getLocalDateString(null)).toBe("-");
    expect(getLocalDateString(undefined)).toBe("-");
  });
});
