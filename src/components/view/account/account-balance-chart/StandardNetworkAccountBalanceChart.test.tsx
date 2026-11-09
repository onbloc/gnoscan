/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";

import theme from "@/styles/theme";
import StandardNetworkAccountBalanceChart from "./StandardNetworkAccountBalanceChart";

const mockUseHistory = jest.fn();
jest.mock("@/common/react-query/account/api/use-get-account-native-balance-history", () => ({
  useGetAccountNativeBalanceHistory: (...args: unknown[]) => mockUseHistory(...args),
}));
jest.mock("@/common/hooks/common/use-token-meta", () => ({
  GNOTToken: { denom: "ugnot", symbol: "GNOT", decimals: 6 },
}));
jest.mock("@/common/hooks/common/use-token-price", () => ({
  useTokenPrice: () => ({ getUsdDisplay: (_key: string, amount: string) => `$${amount}` }),
}));
jest.mock(
  "next/dynamic",
  () => () =>
    function Chart({
      datas,
      selectedDate,
      onSelectDate,
    }: {
      datas: { date: string }[];
      selectedDate: string | null;
      onSelectDate: (date: string) => void;
    }) {
      return (
        <div data-testid="chart" data-selected={selectedDate ?? ""}>
          {datas.length} points
          {datas.map(data => (
            <button key={data.date} data-day={data.date} onClick={() => onSelectDate(data.date)} />
          ))}
        </div>
      );
    },
);
jest.mock("./AccountBalanceDayTransactions", () => ({
  AccountBalanceDayTransactions: ({ date }: { date: string }) => <div data-testid="day-table">{date}</div>,
}));
jest.mock("./BalanceDateFilter", () => ({ BalanceDateFilter: () => null }));

let mockChainId = "chain-a";
jest.mock("@/common/hooks/provider/use-network-provider", () => ({
  useNetworkProvider: () => ({ currentNetwork: { chainId: mockChainId } }),
}));
// Outlives the unmounted chart, like the history entry does.
jest.mock("@/common/hooks/detail-tabs/use-history-entry-state", () => {
  const { useState } = jest.requireActual("react");
  const store = new Map<string, unknown>();
  return {
    useHistoryEntryState: (name: string, initial: unknown) => {
      const [, rerender] = useState(0);
      return [
        store.has(name) ? store.get(name) : initial,
        (action: unknown) => {
          const base = store.has(name) ? store.get(name) : initial;
          store.set(name, typeof action === "function" ? action(base) : action);
          rerender((n: number) => n + 1);
        },
      ];
    },
    __store: store,
  };
});

const address = "g1juss2tuc97sr77rn6vprhh9lr7d9e07uu68x59";
const items = [
  { date: "2026-11-04", balance: "1000000" },
  { date: "2026-11-05", balance: "5000000" },
  { date: "2026-11-06", balance: "2000000" },
];

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;

const text = () => container.textContent ?? "";
const chart = () => container.querySelector("[data-testid=chart]");
const rangeButton = (name: string) =>
  Array.from(container.querySelectorAll<HTMLButtonElement>("button")).find(b => b.textContent === name)!;
// The request the hook was last called with
const lastRequest = () => mockUseHistory.mock.calls[mockUseHistory.mock.calls.length - 1][0];

const render = (query: object) => {
  mockUseHistory.mockReturnValue({ data: undefined, isError: false, isPreviousData: false, ...query });
  act(() =>
    root.render(
      <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
        <StandardNetworkAccountBalanceChart address={address} />
      </ThemeProvider>,
    ),
  );
};

beforeAll(() => Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }));

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(Date.UTC(2026, 10, 6, 12));
  mockChainId = "chain-a";
  jest.requireMock("@/common/hooks/detail-tabs/use-history-entry-state").__store.clear();
  mockUseHistory.mockReset();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  jest.useRealTimers();
});

describe("StandardNetworkAccountBalanceChart", () => {
  it("shows neither chart nor notice while the first range loads", () => {
    render({});

    expect(chart()).toBeNull();
    expect(container.querySelector("[role=status]")).toBeNull();
    expect(text()).not.toContain("Highest Balance");
  });

  it("explains a failed load", () => {
    render({ isError: true });

    expect(text()).toContain("Balance history could not be loaded.");
    expect(chart()).toBeNull();
  });

  it("shows an empty notice, without cards, when every balance is zero", () => {
    render({ data: { items: [{ date: "2026-11-06", balance: "0" }] } });

    expect(text()).toContain("No balance in this period.");
    expect(text()).not.toContain("Highest Balance");
    expect(chart()).toBeNull();
  });

  it("charts the balances and shows the highest and lowest day with their value", () => {
    render({ data: { items } });

    expect(chart()!.textContent).toBe("3 points");
    // The amount and its unit are spaced by CSS, so they join in the text.
    expect(text()).toContain("Highest Balance5GNOT($5)on Nov 5, 2026");
    expect(text()).toContain("Lowest Balance1GNOT($1)on Nov 4, 2026");
  });

  describe("selecting a day", () => {
    const dayButton = (date: string) => container.querySelector<HTMLButtonElement>(`[data-day="${date}"]`)!;
    const table = () => container.querySelector("[data-testid=day-table]");

    it("asks to select a day until one is, then lists its transactions under the chart", () => {
      render({ data: { items } });
      expect(text()).toContain("Select a day on the chart to see its transactions.");
      expect(table()).toBeNull();

      act(() => dayButton("2026-11-05").click());
      expect(table()!.textContent).toBe("2026-11-05");
      expect(chart()!.getAttribute("data-selected")).toBe("2026-11-05");
      expect(text()).not.toContain("Select a day");
    });

    it("switches to another day, and clears the day that is clicked again", () => {
      render({ data: { items } });
      act(() => dayButton("2026-11-05").click());
      act(() => dayButton("2026-11-06").click());
      expect(table()!.textContent).toBe("2026-11-06");

      act(() => dayButton("2026-11-06").click());
      expect(table()).toBeNull();
      expect(chart()!.getAttribute("data-selected")).toBe("");
    });

    it("drops a selected day that the range on screen no longer has, for good", () => {
      render({ data: { items } });
      act(() => dayButton("2026-11-04").click());
      render({ data: { items: items.slice(1) } });
      expect(table()).toBeNull();
      expect(text()).toContain("Select a day on the chart");

      // The range that has the day again does not bring the selection back.
      render({ data: { items } });
      expect(table()).toBeNull();
      expect(chart()!.getAttribute("data-selected")).toBe("");
    });

    it("clears the selection when the range is changed, also back to a range with the day", () => {
      render({ data: { items } });
      act(() => dayButton("2026-11-05").click());
      expect(table()).not.toBeNull();

      act(() => rangeButton("All").click());
      expect(table()).toBeNull();
      act(() => rangeButton("1M").click());
      expect(table()).toBeNull();
      expect(text()).toContain("Select a day on the chart");
    });

    it("shows no table under the notice of a range without balance", () => {
      render({ data: { items: [items[0], { date: "2026-11-05", balance: "0" }] } });
      act(() => dayButton("2026-11-05").click());
      expect(table()).not.toBeNull();

      render({ data: { items: [{ date: "2026-11-05", balance: "0" }] } });
      expect(text()).toContain("No balance in this period.");
      expect(table()).toBeNull();
    });

    it("has nothing to select without a balance", () => {
      render({ data: { items: [{ date: "2026-11-06", balance: "0" }] } });

      expect(text()).not.toContain("Select a day");
    });

    it("restores the range and the day, with its table, after the chart is mounted again", () => {
      render({ data: { items } });
      act(() => rangeButton("All").click());
      act(() => dayButton("2026-11-05").click());

      // Back from a transaction mounts the chart again in the same history entry.
      act(() => root.unmount());
      root = createRoot(container);
      render({ data: { items } });

      expect(lastRequest()).toEqual({ address, range: "all" });
      expect(rangeButton("All").getAttribute("aria-pressed")).toBe("true");
      expect(table()!.textContent).toBe("2026-11-05");
      expect(chart()!.getAttribute("data-selected")).toBe("2026-11-05");
    });

    it("keeps a restored day while its range loads, and drops it once the range lacks the day", () => {
      render({ data: { items } });
      act(() => dayButton("2026-11-04").click());
      act(() => root.unmount());
      root = createRoot(container);

      render({});
      expect(table()).toBeNull();
      render({ data: { items } });
      expect(table()!.textContent).toBe("2026-11-04");

      act(() => root.unmount());
      root = createRoot(container);
      render({ data: { items: items.slice(1) } });
      expect(table()).toBeNull();
      expect(text()).toContain("Select a day on the chart");
    });

    it("restores per account and network", () => {
      render({ data: { items } });
      act(() => dayButton("2026-11-05").click());

      mockChainId = "chain-b";
      act(() => root.unmount());
      root = createRoot(container);
      render({ data: { items } });
      expect(table()).toBeNull();
    });
  });

  it("requests the last 30 days first, then the range of the clicked button", () => {
    render({ data: { items } });
    expect(lastRequest()).toEqual({ address, from: "2026-10-08", to: "2026-11-06" });
    expect(rangeButton("1M").getAttribute("aria-pressed")).toBe("true");

    act(() => rangeButton("All").click());
    expect(lastRequest()).toEqual({ address, range: "all" });
    expect(rangeButton("All").getAttribute("aria-pressed")).toBe("true");
    expect(rangeButton("1M").getAttribute("aria-pressed")).toBe("false");

    act(() => rangeButton("1Y").click());
    expect(lastRequest()).toEqual({ address, from: "2025-11-07", to: "2026-11-06" });
  });

  it("keeps the previous range on screen while the next one loads", () => {
    render({ data: { items }, isPreviousData: true });

    expect(chart()).not.toBeNull();
    expect(text()).toContain("Highest Balance");
    expect(mockUseHistory.mock.calls[0][1]).toEqual({ keepPreviousData: true });
  });
});
