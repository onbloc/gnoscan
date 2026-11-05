/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";

import theme from "@/styles/theme";
import { AccountListDatatable } from "./AccountListDatatable";

let mockSavedPage = 1;
let mockTotalCount = 0;
const mockRequests: { page: number; limit: number }[] = [];

jest.mock("@/common/hooks/common/use-list-pagination", () => ({
  useListPagination: () => [mockSavedPage, jest.fn()],
}));
jest.mock("@/common/react-query/account/api/use-get-accounts", () => ({
  useGetAccounts: (params: { page: number; limit: number }) => {
    mockRequests.push(params);
    return {
      data: { items: [{ address: "g1a" }, { address: "g1b" }], page: { hasNext: true, totalCount: mockTotalCount } },
      isFetched: true,
      isPreviousData: false,
    };
  },
}));
jest.mock("@/components/view/common/table-skeleton/TableSkeleton", () => () => null);
jest.mock("@/assets/svgs/icon-lock.svg", () => ({ __esModule: true, default: () => null }));
jest.mock("@/common/hooks/common/use-token-meta", () => ({ GNOTToken: { denom: "ugnot" } }));
jest.mock("@/components/ui/tooltip", () => ({ __esModule: true, default: () => null }));
jest.mock("@/components/view/datatable", () => ({ DatatableItem: {} }));
jest.mock("@/components/ui/datatable", () => ({
  __esModule: true,
  default: ({ datas }: { datas: { rank: number }[] }) => <p data-testid="ranks">{datas.map(d => d.rank).join(",")}</p>,
  DatatableOption: {
    Builder: {
      builder: () => {
        // Any chain of setters ends in build()
        const chain: object = new Proxy(() => chain, { get: (_, key) => (key === "build" ? () => ({}) : () => chain) });
        return chain;
      },
    },
  },
}));
jest.mock("@/components/ui/pagination", () => ({
  Pagination: ({ page, totalPages }: { page: number; totalPages: number }) => (
    <i data-testid="pagination" data-page={page} data-total={totalPages} />
  ),
}));

function render() {
  const container = document.createElement("div");
  act(() =>
    createRoot(container).render(
      <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
        <AccountListDatatable isCustomNetwork={false} />
      </ThemeProvider>,
    ),
  );
  const query = (id: string) => container.querySelector(`[data-testid=${id}]`) as HTMLElement;
  return { ranks: () => query("ranks").textContent, pagination: () => query("pagination") };
}

beforeAll(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
});

beforeEach(() => {
  mockRequests.length = 0;
  mockSavedPage = 1;
  mockTotalCount = 250;
});

it("requests the saved page and numbers rows from the start of that page", () => {
  mockSavedPage = 3;
  const view = render();

  expect(mockRequests[0]).toMatchObject({ page: 3, limit: 100 });
  expect(view.ranks()).toBe("201,202");
});

it("caps the page count at the top 1000 accounts", () => {
  mockTotalCount = 5_000;
  const view = render();

  expect(view.pagination().dataset.total).toBe("10");
});
