/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

import { FunctionFilterValue } from "@/common/types/function-filter";
import { ALL_FUNCTIONS } from "@/common/values/function-filter.constant";
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

const Probe = ({ filter }: { filter: FunctionFilterValue }) => {
  latest.list = useFunctionFilteredPagedList("list", "gno.land/r/demo", filter, query, { path: "gno.land/r/demo" });
  return null;
};

const include = (...labels: string[]): FunctionFilterValue => ({ mode: "include", labels });
const exclude = (...labels: string[]): FunctionFilterValue => ({ mode: "exclude", labels });

let root: ReturnType<typeof createRoot>;
const render = (filter: FunctionFilterValue) => act(() => root.render(<Probe filter={filter} />));
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
    render(ALL_FUNCTIONS);
    expect(lastRequest()).toEqual({ path: "gno.land/r/demo", page: 1 });

    render(exclude("Vote", "Mint"));
    expect(lastRequest()).toMatchObject({ excludeFunction: ["Mint", "Vote"] });

    render(include("Mint"));
    expect(lastRequest()).toMatchObject({ function: ["Mint"] });
    expect(lastRequest()).not.toHaveProperty("excludeFunction");
  });

  it("starts from page 1 with a different filter", () => {
    render(ALL_FUNCTIONS);
    act(() => latest.list?.pagination.onChangePage(4));
    expect(lastRequest()).toMatchObject({ page: 4 });

    render(exclude("Mint"));

    expect(lastRequest()).toMatchObject({ page: 1, excludeFunction: ["Mint"] });
  });

  it("starts again from page 1 when the earlier filter is applied back", () => {
    render(ALL_FUNCTIONS);
    act(() => latest.list?.pagination.onChangePage(4));
    render(include("Mint"));
    query.mockClear();

    render(ALL_FUNCTIONS);

    // Never asks for the page the earlier filter was left on, not even for one render.
    expect(requests().every(params => params.page === 1)).toBe(true);
  });

  it("keeps the page while the filter stays the same, whatever the order of its labels", () => {
    render(exclude("Mint", "Swap"));
    act(() => latest.list?.pagination.onChangePage(3));

    render(exclude("Swap", "Mint"));

    expect(lastRequest()).toMatchObject({ page: 3 });
  });

  it("keeps the page restored by history navigation when it mounts", () => {
    render(exclude("Mint"));
    act(() => latest.list?.pagination.onChangePage(3));
    act(() => root.unmount());

    root = createRoot(document.createElement("div"));
    render(exclude("Mint"));

    expect(lastRequest()).toMatchObject({ page: 3 });
  });
});
