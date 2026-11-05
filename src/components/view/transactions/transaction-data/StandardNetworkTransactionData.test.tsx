/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

import { FunctionFilterValue } from "@/common/types/function-filter";
import { ALL_FUNCTIONS } from "@/common/values/function-filter.constant";
import StandardNetworkTransactionData from "./StandardNetworkTransactionData";

const mockUseGetTransactions = jest.fn();
let mockOnChangePage: (page: number) => void;

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
jest.mock("@/common/react-query/transaction/api", () => ({
  useGetTransactions: (...args: unknown[]) => mockUseGetTransactions(...args),
}));
jest.mock("../transaction-list-table/standard-network/StandardNetworkTransactionListTable", () => ({
  StandardNetworkTransactionListTable: ({ footer }: { footer: React.ReactNode }) => footer,
}));
jest.mock("@/components/view/common/list-pagination/ListPagination", () => ({
  ListPagination: ({ onChangePage }: { onChangePage: (page: number) => void }) => {
    mockOnChangePage = onChangePage;
    return null;
  },
}));

const include = (...labels: string[]): FunctionFilterValue => ({ mode: "include", labels });
const exclude = (...labels: string[]): FunctionFilterValue => ({ mode: "exclude", labels });

let root: ReturnType<typeof createRoot>;
const render = (filter: FunctionFilterValue) =>
  act(() => root.render(<StandardNetworkTransactionData filter={filter} />));
const requests = () => mockUseGetTransactions.mock.calls.map(([params]) => params);
const lastRequest = () => requests().at(-1);

beforeAll(() => Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }));

beforeEach(() => {
  jest.requireMock("@/common/hooks/detail-tabs/use-history-entry-state").__store.clear();
  mockUseGetTransactions.mockReset().mockReturnValue({
    data: { items: [], page: { totalCount: 400, hasNext: true, snapshotHeight: 200 } },
    isFetched: true,
    isLoading: false,
    isPreviousData: false,
  });
  root = createRoot(document.createElement("div"));
});

afterEach(() => act(() => root.unmount()));

describe("StandardNetworkTransactionData", () => {
  it("lists the first page, unpinned, of a filter that is applied", () => {
    render(ALL_FUNCTIONS);
    act(() => mockOnChangePage(4));
    expect(lastRequest()).toMatchObject({ page: 4, snapshotHeight: 200 });

    render(exclude("Mint"));

    expect(lastRequest()).toEqual({ excludeFunction: ["Mint"], page: 1, snapshotHeight: undefined });
  });

  it("starts again from the first page when the earlier filter is applied back", () => {
    render(ALL_FUNCTIONS);
    act(() => mockOnChangePage(4));
    render(include("Mint"));
    mockUseGetTransactions.mockClear();

    render(ALL_FUNCTIONS);

    // Never asks for the page the earlier filter was left on, not even for one render.
    expect(requests().every(params => params.page === 1 && params.snapshotHeight === undefined)).toBe(true);
  });

  it("keeps the page while the filter stays the same", () => {
    render(exclude("Mint", "Swap"));
    act(() => mockOnChangePage(3));

    render(exclude("Swap", "Mint"));

    expect(lastRequest()).toMatchObject({ page: 3 });
  });

  it("keeps the page restored by history navigation when it mounts", () => {
    render(exclude("Mint"));
    act(() => mockOnChangePage(3));
    act(() => root.unmount());

    root = createRoot(document.createElement("div"));
    render(exclude("Mint"));

    expect(lastRequest()).toMatchObject({ page: 3 });
  });
});
