/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { AxiosError } from "axios";

import { StatisticsQuery, isStatisticsNotReady } from "./statistics-query-policy";
import { useStatisticsFailure } from "./use-statistics-failure";

// React reads this flag from the global scope, whose type does not declare it.
const reactGlobal = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean };
reactGlobal.IS_REACT_ACT_ENVIRONMENT = true;

// TS 4.9 and the supported older Node runtimes do not expose Promise.withResolvers.
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => {
    resolve = done;
  });
  return { promise, resolve };
}

const httpError = (status: number) =>
  new AxiosError("failed", "ERR_BAD_RESPONSE", undefined, undefined, { status } as never);

describe("useStatisticsFailure", () => {
  let queryClient: QueryClient;
  let latest: { failure: StatisticsQuery; isLoading: boolean };
  let container: HTMLDivElement;

  const Probe = ({ queryKey, queryFn }: { queryKey: string; queryFn: () => Promise<unknown> }) => {
    const query = useQuery(queryKey, queryFn, { retry: false });
    latest = { failure: useStatisticsFailure(query), isLoading: query.isLoading };
    return null;
  };

  const mount = async (queryKey: string, queryFn: () => Promise<unknown>) => {
    const root = createRoot(container);
    const render = (key: string, fn: () => Promise<unknown>) =>
      act(async () => {
        root.render(
          <QueryClientProvider client={queryClient}>
            <Probe queryKey={key} queryFn={fn} />
          </QueryClientProvider>,
        );
      });
    await render(queryKey, queryFn);
    return render;
  };

  beforeEach(() => {
    queryClient = new QueryClient();
    container = document.createElement("div");
  });

  it("keeps the failure while a polled data-less query refetches, so the notice does not flash a skeleton", async () => {
    let attempt = 0;
    const refetch = deferred<unknown>();
    await mount("polled", () => {
      attempt += 1;
      return attempt === 1 ? Promise.reject(httpError(404)) : refetch.promise;
    });

    expect(latest.failure.isError).toBe(true);
    expect(isStatisticsNotReady(latest.failure.error)).toBe(true);

    await act(async () => {
      queryClient.refetchQueries("polled");
    });

    // react-query is back to loading and has dropped the error, but the failure is still reported.
    expect(latest.isLoading).toBe(true);
    expect(latest.failure.isError).toBe(true);
    expect(isStatisticsNotReady(latest.failure.error)).toBe(true);

    await act(async () => {
      refetch.resolve({ ok: true });
    });

    expect(latest.failure).toMatchObject({ isError: false, data: { ok: true } });
  });

  it("does not carry a failure over to a different query", async () => {
    const render = await mount("first", () => Promise.reject(httpError(500)));
    expect(latest.failure.isError).toBe(true);

    await render("second", () => new Promise(() => undefined));

    expect(latest.isLoading).toBe(true);
    expect(latest.failure.isError).toBe(false);
  });

  it("does not report a failed refresh while data is still available", async () => {
    let attempt = 0;
    await mount("stale", () => {
      attempt += 1;
      return attempt === 1 ? Promise.resolve({ ok: true }) : Promise.reject(httpError(500));
    });

    await act(async () => {
      await queryClient.refetchQueries("stale");
    });

    expect(latest.failure).toMatchObject({ isError: false, data: { ok: true } });
  });
});
