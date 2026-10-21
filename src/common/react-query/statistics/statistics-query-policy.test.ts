import { AxiosError } from "axios";
import {
  combineStatisticsQueries,
  isStatisticsNotReady,
  retryStatisticsQuery,
  StatisticsQuery,
} from "./statistics-query-policy";

const httpError = (status: number) =>
  new AxiosError("failed", "ERR_BAD_RESPONSE", undefined, undefined, { status } as never);

describe("statistics query policy", () => {
  it("treats only an HTTP 404 as statistics not ready", () => {
    expect(isStatisticsNotReady(httpError(404))).toBe(true);
    expect(isStatisticsNotReady(httpError(500))).toBe(false);
    expect(isStatisticsNotReady(new Error("Network Error"))).toBe(false);
    expect(isStatisticsNotReady(undefined)).toBe(false);
  });

  it("does not retry a 404, so the unavailable notice shows immediately", () => {
    expect(retryStatisticsQuery(0, httpError(404))).toBe(false);
  });

  it("retries other failures at most three times", () => {
    expect(retryStatisticsQuery(0, httpError(500))).toBe(true);
    expect(retryStatisticsQuery(2, new Error("Network Error"))).toBe(true);
    expect(retryStatisticsQuery(3, httpError(500))).toBe(false);
  });
});

describe("combineStatisticsQueries", () => {
  const available: StatisticsQuery = { data: {}, error: null, isError: false };
  const unavailable404: StatisticsQuery = { data: undefined, error: httpError(404), isError: true };
  const unavailable500: StatisticsQuery = { data: undefined, error: httpError(500), isError: true };

  it("reports no error while every statistic is available", () => {
    expect(combineStatisticsQueries([available, available]).isError).toBe(false);
  });

  it("reports the first unavailable statistic", () => {
    const combined = combineStatisticsQueries([available, unavailable404, unavailable500]);

    expect(combined.isError).toBe(true);
    expect(isStatisticsNotReady(combined.error)).toBe(true);
  });
});
