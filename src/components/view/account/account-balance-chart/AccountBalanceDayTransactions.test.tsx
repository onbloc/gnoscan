/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";

import theme from "@/styles/theme";
import { AccountBalanceDayTransactions } from "./AccountBalanceDayTransactions";

const mockUsePagedList = jest.fn();
jest.mock("@/common/hooks/common/use-paged-list", () => ({
  usePagedList: (...args: unknown[]) => mockUsePagedList(...args),
}));
jest.mock("@/common/react-query/account/api/use-get-account-native-balance-changes", () => ({
  useGetAccountNativeBalanceChanges: jest.fn(),
}));
jest.mock("../../common/list-pagination/ListPagination", () => ({ ListPagination: () => null }));
jest.mock("../../datatable/account-balance-change", () => ({
  AccountBalanceChangeDatatable: ({ data }: { data: unknown[] }) => <div data-testid="table">{data.length}</div>,
}));

const address = "g1juss2tuc97sr77rn6vprhh9lr7d9e07uu68x59";

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;

beforeAll(() => Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }));

beforeEach(() => {
  mockUsePagedList.mockReset().mockReturnValue({ items: [{}, {}], isFetched: true, pagination: {} });
  container = document.createElement("div");
  root = createRoot(container);
  act(() =>
    root.render(
      <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
        <AccountBalanceDayTransactions address={address} date="2026-10-23" />
      </ThemeProvider>,
    ),
  );
});

afterEach(() => act(() => root.unmount()));

describe("AccountBalanceDayTransactions", () => {
  it("lists the transactions of the day under its date", () => {
    expect(container.textContent).toContain("Oct 23, 2026 Transactions");
    expect(container.querySelector("[data-testid=table]")!.textContent).toBe("2");
  });

  it("asks for that UTC day alone, apart from the lists of other days, and drops the rows of the previous day", () => {
    const [name, scope, , params, options] = mockUsePagedList.mock.calls[0];

    expect(params).toEqual({ address, from: "2026-10-23", to: "2026-10-23" });
    expect(scope).toBe(`${address}:2026-10-23`);
    expect(name).toBe("account-balance-day");
    expect(options).toEqual({ keepPreviousData: false });
  });
});
