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
  const healthy: StatisticsQuery = { data: {}, error: null, isError: false, isFetching: false, refetch: jest.fn() };

  it("reports no error while every query is healthy", () => {
    expect(combineStatisticsQueries([healthy, healthy]).isError).toBe(false);
  });

  it("merges several failures into one notice and retries all of them", () => {
    const refetchSupply = jest.fn();
    const refetchPrice = jest.fn();
    const noData404: StatisticsQuery = {
      data: undefined,
      error: httpError(404),
      isError: true,
      isFetching: false,
      refetch: refetchSupply,
    };
    const stale500: StatisticsQuery = {
      data: {},
      error: httpError(500),
      isError: true,
      isFetching: true,
      refetch: refetchPrice,
    };

    const combined = combineStatisticsQueries([stale500, healthy, noData404]);

    // The failure without data wins, so the notice does not claim stale data is on screen.
    expect(combined).toMatchObject({ isError: true, data: undefined, isFetching: true });
    expect(isStatisticsNotReady(combined.error)).toBe(true);

    combined.refetch();
    expect(refetchSupply).toHaveBeenCalledTimes(1);
    expect(refetchPrice).toHaveBeenCalledTimes(1);
    expect(healthy.refetch).not.toHaveBeenCalled();
  });
});
