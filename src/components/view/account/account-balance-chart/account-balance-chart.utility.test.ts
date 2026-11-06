import {
  BALANCE_RANGE,
  findBalanceExtremes,
  makeBalanceHistoryRequest,
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

  it("asks for the whole history without a date bound", () => {
    expect(makeBalanceHistoryRequest(address, BALANCE_RANGE.ALL, now)).toEqual({ address, range: "all" });
  });
});

describe("toBalanceChartPoints", () => {
  it("converts ugnot to GNOT", () => {
    expect(toBalanceChartPoints([{ date: "2026-11-06", balance: "1500000" }])).toEqual([
      { date: "2026-11-06", value: 1.5 },
    ]);
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
