/** @jest-environment jsdom */
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { QueryClient, QueryClientProvider } from "react-query";
import { setTimeout as delay } from "node:timers/promises";

import { FunctionFilterValue } from "@/common/types/function-filter";
import { ListCsv } from "@/common/hooks/common/use-publish-list-csv";
import { QUERY_KEY as META_QUERY_KEY } from "@/common/react-query/meta/types";
import { TransactionModel } from "@/models/api/transaction/transaction-model";
import { ALL_FUNCTIONS } from "@/common/values/function-filter.constant";
import StandardNetworkTransactionData from "./StandardNetworkTransactionData";

const mockUseGetTransactions = jest.fn();
const mockTokenRepository = { getTokenMetaByPath: jest.fn() };
let mockOnChangePage: (page: number) => void;
let mockOnChangePageSize: (pageSize: number) => void;

jest.mock("@/common/hooks/provider/use-network-provider", () => ({
  useNetworkProvider: () => ({ currentNetwork: { chainId: "chain-a" } }),
}));
jest.mock("@/common/hooks/provider/use-service-provider", () => ({
  useServiceProvider: () => ({ apiTokenRepository: mockTokenRepository, blockRepository: {} }),
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
jest.mock("@/components/view/common/list-footer/ListFooter", () => ({
  ListFooter: (props: { onChangePage: (page: number) => void; onChangePageSize: (pageSize: number) => void }) => {
    mockOnChangePage = props.onChangePage;
    mockOnChangePageSize = props.onChangePageSize;
    return null;
  },
}));
jest.mock("@/common/hooks/common/use-token-meta", () => ({
  GNOTToken: { symbol: "GNOT", denom: "ugnot", decimals: 6 },
}));

const include = (...labels: string[]): FunctionFilterValue => ({ mode: "include", labels });
const exclude = (...labels: string[]): FunctionFilterValue => ({ mode: "exclude", labels });

let root: Root;
let client: QueryClient;
const render = (filter: FunctionFilterValue, onCsvChange?: (csv: ListCsv | null) => void) =>
  act(() =>
    root.render(
      <QueryClientProvider client={client}>
        <StandardNetworkTransactionData filter={filter} onCsvChange={onCsvChange} />
      </QueryClientProvider>,
    ),
  );
const requests = () => mockUseGetTransactions.mock.calls.map(([params]) => params);
const lastRequest = () => requests().at(-1);

beforeAll(() => Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }));

beforeEach(() => {
  jest.requireMock("@/common/hooks/detail-tabs/use-history-entry-state").__store.clear();
  mockTokenRepository.getTokenMetaByPath.mockReset();
  client = new QueryClient({
    defaultOptions: { queries: { retry: false, cacheTime: Infinity } },
  });
  client.setQueryData([META_QUERY_KEY.getTokenMeta, "chain-a"], []);
  mockUseGetTransactions.mockReset().mockReturnValue({
    data: { items: [], page: { totalCount: 400, hasNext: true, snapshotHeight: 200 } },
    isFetched: true,
    isLoading: false,
    isPreviousData: false,
  });
  root = createRoot(document.createElement("div"));
});

afterEach(() => {
  act(() => root.unmount());
  client.clear();
});

describe("StandardNetworkTransactionData", () => {
  it("lists the first page, unpinned, of a filter that is applied", () => {
    render(ALL_FUNCTIONS);
    act(() => mockOnChangePage(4));
    expect(lastRequest()).toMatchObject({ page: 4, snapshotHeight: 200 });

    render(exclude("Mint"));

    expect(lastRequest()).toEqual({ excludeFunction: ["Mint"], page: 1, limit: 50, snapshotHeight: undefined });
  });

  it("lists the first page, unpinned, of the page size chosen", () => {
    render(ALL_FUNCTIONS);
    act(() => mockOnChangePage(4));
    expect(lastRequest()).toMatchObject({ page: 4, limit: 50, snapshotHeight: 200 });

    act(() => mockOnChangePageSize(25));

    expect(lastRequest()).toEqual({ page: 1, limit: 25, snapshotHeight: undefined });
  });

  it("starts again from the first page when the earlier page size is chosen back", () => {
    render(ALL_FUNCTIONS);
    act(() => mockOnChangePage(4));
    act(() => mockOnChangePageSize(25));
    mockUseGetTransactions.mockClear();

    act(() => mockOnChangePageSize(50));

    expect(requests().every(params => params.page === 1 && params.snapshotHeight === undefined)).toBe(true);
    expect(lastRequest()).toMatchObject({ page: 1, limit: 50 });
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

  it("publishes human-scale CSV only after the current page's token metadata resolves", async () => {
    const denom = "gno.land/r/demo/token.TOKEN";
    const tx: TransactionModel = {
      txHash: "current-page-tx",
      blockHeight: 100,
      timestamp: "2026-01-01T00:00:00Z",
      successYn: true,
      messageCount: 1,
      fromAddress: "sender",
      fromName: "",
      toAddress: "recipient",
      toName: "",
      amount: { value: "1234567890123456789", denom },
      fee: { value: "1000000", denom: "ugnot" },
      func: [],
    };
    let resolveMetadata!: (value: { data: { symbol: string; decimals: number } }) => void;
    const pending = new Promise<{ data: { symbol: string; decimals: number } }>(resolve => {
      resolveMetadata = resolve;
    });
    mockTokenRepository.getTokenMetaByPath.mockReturnValue(pending);
    mockUseGetTransactions.mockReturnValue({
      data: { items: [tx], page: { totalCount: 400, hasNext: true, snapshotHeight: 200 } },
      isFetched: true,
      isLoading: false,
      isPreviousData: false,
    });
    const onCsvChange = jest.fn();
    render(exclude("Mint"), onCsvChange);
    expect(onCsvChange.mock.calls.at(-1)?.[0]).toMatchObject({ page: 1, isSettled: false });

    resolveMetadata({ data: { symbol: "TOKEN", decimals: 9 } });
    await act(async () => {
      await delay(0);
      await delay(0);
    });

    const csv: ListCsv = onCsvChange.mock.calls.at(-1)?.[0];
    expect(csv.isSettled).toBe(true);
    expect(csv.rows).toHaveLength(1);
    expect(csv.rows[0][0]).toBe("current-page-tx");
    expect(csv.rows[0].slice(8, 12)).toEqual(["1234567890.123456", "TOKEN", "1", "GNOT"]);
    expect(lastRequest()).toMatchObject({ excludeFunction: ["Mint"], page: 1, limit: 50 });

    mockUseGetTransactions.mockReturnValue({
      data: { items: [tx], page: { totalCount: 400, hasNext: true, snapshotHeight: 200 } },
      isFetched: true,
      isLoading: false,
      isPreviousData: true,
    });
    render(exclude("Mint"), onCsvChange);
    expect(onCsvChange.mock.calls.at(-1)?.[0].isSettled).toBe(false);
  });

  it("exports More and zero placeholders without waiting for their unused metadata", () => {
    const base = {
      blockHeight: 100,
      timestamp: "2026-01-01T00:00:00Z",
      successYn: true,
      fromAddress: "sender",
      fromName: "",
      toAddress: "recipient",
      toName: "",
      fee: { value: "1000000", denom: "ugnot" },
      func: [],
    };
    mockUseGetTransactions.mockReturnValue({
      data: {
        items: [
          { ...base, txHash: "multi", messageCount: 2, amount: { value: "123", denom: "unknown-multi" } },
          { ...base, txHash: "zero", messageCount: 1, amount: { value: "0.000", denom: "unknown-zero" } },
          { ...base, txHash: "empty", messageCount: 1, amount: {} },
        ],
        page: { totalCount: 3, hasNext: false, snapshotHeight: 200 },
      },
      isFetched: true,
      isLoading: false,
      isPreviousData: false,
    });
    const onCsvChange = jest.fn();
    render(ALL_FUNCTIONS, onCsvChange);

    const csv: ListCsv = onCsvChange.mock.calls.at(-1)?.[0];
    expect(csv.isSettled).toBe(true);
    expect(csv.rows.map(row => row.slice(8, 10))).toEqual([
      ["More", ""],
      ["-", ""],
      ["", ""],
    ]);
    expect(mockTokenRepository.getTokenMetaByPath).not.toHaveBeenCalled();
  });
});
