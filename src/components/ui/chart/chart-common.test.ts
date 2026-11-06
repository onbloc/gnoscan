import { formatChartDate } from "./chart-common";

describe("formatChartDate", () => {
  it("keeps the UTC day whatever the time zone of the viewer", () => {
    expect(formatChartDate("2026-11-01", { month: "short", day: "numeric", year: "numeric" })).toBe("Nov 1, 2026");
  });

  it("returns an unparsable date as is", () => {
    expect(formatChartDate("soon", { month: "short" })).toBe("soon");
  });
});
