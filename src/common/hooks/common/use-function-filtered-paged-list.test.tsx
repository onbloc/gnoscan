/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

import { FunctionFilterValue } from "@/common/types/function-filter";
import { useFunctionFilteredPagedList } from "./use-function-filtered-paged-list";

jest.mock("@/common/hooks/provider/use-network-provider", () => ({
  useNetworkProvider: () => ({ currentNetwork: { chainId: "chain-a" } }),
}));
// The history entry state of the page, kept in memory.
jest.mock("@/common/hooks/detail-tabs/use-history-entry-state", () => {
  const { useState } = jest.requireActual("react");
  const store = new Map<string, unknown>();
  return {
    useHistoryEntryState: (name: string, initial: unknown) => {
      const [, rerender] = useState(0);
      return [
        store.has(name) ? store.get(name) : initial,
        (value: unknown) => {
          store.set(name, value);
          rerender((n: number) => n + 1);
        },
      ];
    },
    __store: store,
  };
});

const query = jest.fn();
// Latest result of the hook under test.
const latest: { list?: ReturnType<typeof useFunctionFilteredPagedList> } = {};

const Probe = () => {
  latest.list = useFunctionFilteredPagedList("list", "gno.land/r/demo", query, { path: "gno.land/r/demo" });
  return null;
};

const include = (...labels: string[]): FunctionFilterValue => ({ mode: "include", labels });
const exclude = (...labels: string[]): FunctionFilterValue => ({ mode: "exclude", labels });

let root: ReturnType<typeof createRoot>;
const mount = () => act(() => root.render(<Probe />));
const setFilter = (filter: FunctionFilterValue) => act(() => latest.list?.setFilter(filter));
const setPage = (page: number) => act(() => latest.list?.pagination.onChangePage(page));
const requests = () => query.mock.calls.map(([params]) => params);
const lastRequest = () => requests().at(-1);

beforeAll(() => Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }));

beforeEach(() => {
  jest.requireMock("@/common/hooks/detail-tabs/use-history-entry-state").__store.clear();
  query.mockReset().mockReturnValue({
    data: { items: [], page: { totalCount: 400, hasNext: true } },
    isFetched: true,
    isPreviousData: false,
  });
  root = createRoot(document.createElement("div"));
});

afterEach(() => act(() => root.unmount()));

describe("useFunctionFilteredPagedList", () => {
  it("requests the labels of the filter next to the params of the list, none for All", () => {
    mount();
    expect(lastRequest()).toEqual({ path: "gno.land/r/demo", page: 1 });

    setFilter(exclude("Vote", "Mint"));
    expect(lastRequest()).toMatchObject({ excludeFunction: ["Mint", "Vote"] });

    setFilter(include("Mint"));
    expect(lastRequest()).toMatchObject({ function: ["Mint"] });
    expect(lastRequest()).not.toHaveProperty("excludeFunction");
  });

  it("returns the filter it applies", () => {
    mount();
    expect(latest.list?.filter).toEqual({ mode: "exclude", labels: [] });

    setFilter(include("Mint"));
    expect(latest.list?.filter).toEqual(include("Mint"));
  });

  it("starts from page 1 with a different filter", () => {
    mount();
    setPage(4);
    expect(lastRequest()).toMatchObject({ page: 4 });

    setFilter(exclude("Mint"));

    expect(lastRequest()).toMatchObject({ page: 1, excludeFunction: ["Mint"] });
  });

  it("starts again from page 1 when the earlier filter is applied back", () => {
    mount();
    const all = latest.list!.filter;
    setPage(4);
    setFilter(include("Mint"));
    query.mockClear();

    setFilter(all);

    // Never asks for the page the earlier filter was left on, not even for one render.
    expect(requests().every(params => params.page === 1)).toBe(true);
  });

  it("keeps the page while the filter stays the same, whatever the order of its labels", () => {
    mount();
    setFilter(exclude("Mint", "Swap"));
    setPage(3);

    setFilter(exclude("Swap", "Mint"));

    expect(lastRequest()).toMatchObject({ page: 3 });
  });

  it("keeps the page when the filter changes between nothing checked and all checked", () => {
    mount();
    setPage(3);
    query.mockClear();

    setFilter(include());
    expect(lastRequest()).toEqual({ path: "gno.land/r/demo", page: 3 });

    setFilter(exclude());
    expect(lastRequest()).toEqual({ path: "gno.land/r/demo", page: 3 });
    expect(requests().every(params => params.page === 3)).toBe(true);
  });

  it("keeps the filter and page restored by history navigation when it mounts", () => {
    mount();
    setFilter(exclude("Mint"));
    setPage(3);
    act(() => root.unmount());

    root = createRoot(document.createElement("div"));
    mount();

    expect(lastRequest()).toMatchObject({ page: 3, excludeFunction: ["Mint"] });
  });
});
