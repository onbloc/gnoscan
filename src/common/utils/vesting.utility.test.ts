import { formatVestingDate, parseVestingTime } from "./vesting.utility";

const END_ISO = "2028-01-01T00:00:00Z";

describe("parseVestingTime", () => {
  it("parses ISO strings", () => {
    expect(parseVestingTime(END_ISO)?.toISOString()).toBe("2028-01-01T00:00:00.000Z");
  });

  it("returns null for missing or invalid values", () => {
    expect(parseVestingTime(undefined)).toBeNull();
    expect(parseVestingTime(null)).toBeNull();
    expect(parseVestingTime("")).toBeNull();
    expect(parseVestingTime("not-a-date")).toBeNull();
  });
});

describe("formatVestingDate", () => {
  it("formats in UTC regardless of local timezone", () => {
    expect(formatVestingDate(new Date("2028-09-12T15:00:00Z"))).toBe("Sep 12, 2028");
    expect(formatVestingDate(new Date("2027-07-01T00:00:00Z"))).toBe("Jul 1, 2027");
  });

  it("supports the long month format used on the account detail", () => {
    // Detail API sends RFC3339 end times
    const endDate = parseVestingTime("2027-12-31T23:59:59Z");
    expect(endDate && formatVestingDate(endDate, "long")).toBe("December 31, 2027");
  });
});
