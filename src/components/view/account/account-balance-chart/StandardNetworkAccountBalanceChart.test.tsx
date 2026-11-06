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
    function Chart({ datas }: { datas: unknown[] }) {
      return <div data-testid="chart">{datas.length} points</div>;
    },
);
jest.mock("./BalanceDateFilter", () => ({ BalanceDateFilter: () => null }));

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
