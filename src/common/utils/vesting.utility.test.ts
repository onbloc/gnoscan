import { GENESIS_VESTING_END, formatVestingDate, parseVestingTime } from "./vesting.utility";

const END_ISO = "2028-01-01T00:00:00Z";
const END_UNIX = 1830297600;

describe("parseVestingTime", () => {
  it("parses ISO strings", () => {
    expect(parseVestingTime(END_ISO)?.toISOString()).toBe("2028-01-01T00:00:00.000Z");
  });

  it("parses unix seconds as number or numeric string", () => {
    expect(parseVestingTime(END_UNIX)?.toISOString()).toBe("2028-01-01T00:00:00.000Z");
    expect(parseVestingTime(`${END_UNIX}`)?.toISOString()).toBe("2028-01-01T00:00:00.000Z");
  });

  it("returns null for missing or invalid values", () => {
    expect(parseVestingTime(undefined)).toBeNull();
    expect(parseVestingTime(null)).toBeNull();
    expect(parseVestingTime("")).toBeNull();
    expect(parseVestingTime("not-a-date")).toBeNull();
    expect(parseVestingTime(Number.NaN)).toBeNull();
    expect(parseVestingTime("9".repeat(400))).toBeNull();
  });
});

describe("formatVestingDate", () => {
  it("formats in UTC regardless of local timezone", () => {
    expect(formatVestingDate(GENESIS_VESTING_END)).toBe("Jan 1, 2028");
    expect(formatVestingDate(new Date("2027-07-01T00:00:00Z"))).toBe("Jul 1, 2027");
  });

  it("supports the long month format used on the account detail", () => {
    // Detail API sends RFC3339 end times
    const endDate = parseVestingTime("2027-12-31T23:59:59Z");
    expect(endDate && formatVestingDate(endDate, "long")).toBe("December 31, 2027");
  });
});
