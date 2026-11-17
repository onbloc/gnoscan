/** @jest-environment jsdom */
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { setTimeout as delay } from "node:timers/promises";

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

async function settle(update?: () => void) {
  await act(async () => {
    update?.();
    await delay(0);
    await delay(0);
  });
}

describe("useStatisticsFailure", () => {
  let queryClient: QueryClient;
  let latest: { failure: StatisticsQuery };
  let root: Root;

  const Probe = ({ queryKey, queryFn }: { queryKey: string; queryFn: () => Promise<unknown> }) => {
    const query = useQuery([queryKey], queryFn, { retry: false });
    latest = { failure: useStatisticsFailure(query) };
    return null;
  };

  const mount = async (queryKey: string, queryFn: () => Promise<unknown>) => {
    const render = (key: string, fn: () => Promise<unknown>) =>
      act(() => {
        root.render(
          <QueryClientProvider client={queryClient}>
            <Probe queryKey={key} queryFn={fn} />
          </QueryClientProvider>,
        );
      });
    await render(queryKey, queryFn);
    await settle();
    return render;
  };

  beforeEach(() => {
    queryClient = new QueryClient();
    root = createRoot(document.createElement("div"));
  });

  afterEach(() => {
    act(() => root.unmount());
    queryClient.clear();
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

    await settle(() => {
      void queryClient.refetchQueries(["polled"]);
    });

    expect(latest.failure.isError).toBe(true);
    expect(isStatisticsNotReady(latest.failure.error)).toBe(true);

    await settle(() => refetch.resolve({ ok: true }));

    expect(latest.failure).toMatchObject({ isError: false, data: { ok: true } });
  });

  it("does not carry a failure over to a different query", async () => {
    const render = await mount("first", () => Promise.reject(httpError(500)));
    expect(latest.failure.isError).toBe(true);

    await render("second", () => new Promise(() => undefined));

    expect(latest.failure.isError).toBe(false);
  });

  it("does not report a failed refresh while data is still available", async () => {
    let attempt = 0;
    await mount("stale", () => {
      attempt += 1;
      return attempt === 1 ? Promise.resolve({ ok: true }) : Promise.reject(httpError(500));
    });

    await act(async () => {
      await queryClient.refetchQueries(["stale"]);
    });
    await settle();

    expect(latest.failure).toMatchObject({ isError: false, data: { ok: true } });
  });
});
