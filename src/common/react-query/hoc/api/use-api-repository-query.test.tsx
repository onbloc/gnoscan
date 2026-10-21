/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { QueryClient, QueryClientProvider } from "react-query";
import { setTimeout as delay } from "node:timers/promises";

import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
import { useApiRepositoryInfiniteQuery } from "./use-api-repository-infinite-query";
import { useApiRepositoryQuery } from "./use-api-repository-query";

jest.mock("@/common/hooks/provider/use-network-provider", () => ({
  useNetworkProvider: () => ({ currentNetwork: { chainId: "test-chain" } }),
}));

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const REPOSITORY_NAME = API_REPOSITORY_KEY.ACCOUNT_REPOSITORY;
const cleanups: (() => void)[] = [];

afterEach(() => cleanups.splice(0).forEach(cleanup => cleanup()));

async function render(element: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const root = createRoot(document.createElement("div"));
  act(() => root.render(<QueryClientProvider client={client}>{element}</QueryClientProvider>));
  await act(async () => {
    await delay(0);
    await delay(0);
  });
  cleanups.push(() => {
    act(() => root.unmount());
    client.clear();
  });
}

const cases = [
  { repository: null, enabled: true, calls: 0 },
  { repository: {}, enabled: false, calls: 0 },
  { repository: {}, enabled: undefined, calls: 1 },
  { repository: {}, enabled: true, calls: 1 },
];

describe("useApiRepositoryQuery", () => {
  it.each(cases)("repository $repository with enabled $enabled calls queryFn $calls time(s)", async c => {
    const queryFn = jest.fn().mockResolvedValue("data");
    const statuses: string[] = [];

    function Probe() {
      const { status } = useApiRepositoryQuery(["key"], c.repository, REPOSITORY_NAME, queryFn, {
        enabled: c.enabled,
      });
      statuses.push(status);
      return null;
    }

    await render(<Probe />);

    expect(queryFn).toHaveBeenCalledTimes(c.calls);
    expect(statuses).not.toContain("error");
  });
});

describe("useApiRepositoryInfiniteQuery", () => {
  it.each(cases)("repository $repository with enabled $enabled calls queryFn $calls time(s)", async c => {
    const queryFn = jest.fn().mockResolvedValue({ page: { hasNext: false } });
    const statuses: string[] = [];

    function Probe() {
      const { status } = useApiRepositoryInfiniteQuery(["key"], c.repository, REPOSITORY_NAME, queryFn, {
        enabled: c.enabled,
      });
      statuses.push(status);
      return null;
    }

    await render(<Probe />);

    expect(queryFn).toHaveBeenCalledTimes(c.calls);
    expect(statuses).not.toContain("error");
  });
});
