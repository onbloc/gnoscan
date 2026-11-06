import {
  BALANCE_RANGE,
  findBalanceExtremes,
  makeBalanceHistoryRequest,
  makeRecentRange,
  validateCustomRange,
  toBalanceChartPoints,
} from "./account-balance-chart.utility";

jest.mock("@/common/hooks/common/use-token-meta", () => ({ GNOTToken: { symbol: "GNOT", decimals: 6 } }));

const address = "g1juss2tuc97sr77rn6vprhh9lr7d9e07uu68x59";
const now = Date.UTC(2026, 10, 6, 23, 59);

describe("makeBalanceHistoryRequest", () => {
  it("counts a bounded range back from the UTC day of now, inclusive", () => {
    expect(makeBalanceHistoryRequest(address, BALANCE_RANGE.ONE_MONTH, now)).toEqual({
      address,
      from: "2026-10-08",
      to: "2026-11-06",
    });
  });

  it("keeps 1Y within the 365 days the API accepts", () => {
    expect(makeBalanceHistoryRequest(address, BALANCE_RANGE.ONE_YEAR, now)).toEqual({
      address,
      from: "2025-11-07",
      to: "2026-11-06",
    });
  });

  it("requests a picked range as it is", () => {
    expect(makeBalanceHistoryRequest(address, { from: "2026-01-01", to: "2026-02-01" }, now)).toEqual({
      address,
      from: "2026-01-01",
      to: "2026-02-01",
    });
  });

  it("asks for the whole history without a date bound", () => {
    expect(makeBalanceHistoryRequest(address, BALANCE_RANGE.ALL, now)).toEqual({ address, range: "all" });
  });
});

describe("toBalanceChartPoints", () => {
  it("converts ugnot to GNOT", () => {
    expect(toBalanceChartPoints([{ date: "2026-11-06", balance: "1500000" }])).toEqual([
      { date: "2026-11-06", balance: "1.5", value: 1.5 },
    ]);
  });

  it("keeps the exact balance where the plotting value loses it", () => {
    const [point] = toBalanceChartPoints([{ date: "2026-11-06", balance: "10000000000000001" }]);

    expect(point.balance).toBe("10000000000.000001");
    expect(point.value.toString()).not.toBe(point.balance);
  });
});

describe("findBalanceExtremes", () => {
  it("finds the highest and lowest day, comparing amounts beyond 64 bits exactly", () => {
    const items = [
      { date: "2026-11-01", balance: "100000000000000000000000001" },
      { date: "2026-11-02", balance: "100000000000000000000000000" },
      { date: "2026-11-03", balance: "100000000000000000000000001" },
    ];

    expect(findBalanceExtremes(items)).toEqual({
      highest: { date: "2026-11-01", value: "100000000000000000000.000001" },
      lowest: { date: "2026-11-02", value: "100000000000000000000" },
    });
  });

  it("is null without points", () => {
    expect(findBalanceExtremes([])).toBeNull();
  });
});

describe("makeRecentRange", () => {
  it("ends on the UTC day of now", () => {
    expect(makeRecentRange(now, 30)).toEqual({ from: "2026-10-08", to: "2026-11-06" });
  });
});

describe("validateCustomRange", () => {
  const today = "2026-11-06";

  it("accepts a range within 365 days up to today", () => {
    expect(validateCustomRange({ from: "2025-11-07", to: today }, today)).toBeNull();
    expect(validateCustomRange({ from: today, to: today }, today)).toBeNull();
  });

  it("rejects a missing date", () => {
    expect(validateCustomRange({ from: "", to: today }, today)).toBe("Select both dates.");
  });

  it("rejects a start after the end", () => {
    expect(validateCustomRange({ from: "2026-11-02", to: "2026-11-01" }, today)).toMatch(/must not be after/);
  });

  it("rejects an end after today, as the API reports no later day", () => {
    expect(validateCustomRange({ from: "2026-11-01", to: "2026-11-07" }, today)).toMatch(/future/);
  });

  it("rejects 366 days, counting both ends, across a leap day", () => {
    expect(validateCustomRange({ from: "2025-11-06", to: today }, today)).toMatch(/365 days/);
    expect(validateCustomRange({ from: "2023-03-02", to: "2024-02-29" }, today)).toBeNull();
    expect(validateCustomRange({ from: "2023-03-01", to: "2024-02-29" }, today)).toMatch(/365 days/);
  });
});
