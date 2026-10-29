/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

import ValidatorsContainer from "./ValidatorsContainer";

let mockItems: { address: string }[] = [];
let mockTotalCount = 0;
let mockSavedPage = 1;
let mockIsPreviousData = false;
const mockSetPage = jest.fn();
const mockRequests: { page: number; limit: number }[] = [];

jest.mock("@/common/hooks/detail-tabs/use-history-entry-state", () => ({
  useHistoryEntryState: () => [mockSavedPage, mockSetPage],
}));
jest.mock("@/common/hooks/provider/use-network-provider", () => ({
  useNetworkProvider: () => ({ currentNetwork: { chainId: "chain-a" } }),
}));
jest.mock("@/common/react-query/validator/api/use-get-validators", () => ({
  useGetValidators: (params: { page: number; limit: number }) => {
    mockRequests.push(params);
    return {
      data: { items: mockItems, page: { hasNext: true, totalCount: mockTotalCount } },
      isFetched: true,
      isPreviousData: mockIsPreviousData,
    };
  },
}));
jest.mock("@/common/react-query/validator/api/use-get-validator-commits", () => ({
  useGetValidatorCommits: () => ({ data: undefined }),
}));
jest.mock("@/components/view/common/table-skeleton/TableSkeleton", () => () => null);
jest.mock("@/components/view/validator/validator-table/ValidatorTable", () => ({
  __esModule: true,
  default: ({ validators, footer }: { validators: { address: string }[]; footer: React.ReactNode }) => (
    <div>
      <p data-testid="rows">{validators.map(v => v.address).join(",")}</p>
      {footer}
    </div>
  ),
}));
jest.mock("@/components/ui/pagination", () => ({
  Pagination: ({
    page,
    totalPages,
    onChangePage,
  }: {
    page: number;
    totalPages: number;
    onChangePage: (page: number) => void;
  }) => <button data-testid="pagination" data-page={page} data-total={totalPages} onClick={() => onChangePage(99)} />,
}));

function render() {
  const container = document.createElement("div");
  act(() => createRoot(container).render(<ValidatorsContainer />));
  const query = (id: string) => container.querySelector(`[data-testid=${id}]`) as HTMLElement;
  return { rows: () => query("rows").textContent, pagination: () => query("pagination") };
}

beforeAll(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
});

beforeEach(() => {
  jest.clearAllMocks();
  mockRequests.length = 0;
  mockSavedPage = 1;
  mockIsPreviousData = false;
  mockItems = [{ address: "a1" }];
  mockTotalCount = 45;
});

it("requests the saved page and derives the page count from totalCount", () => {
  mockSavedPage = 2;
  const view = render();

  expect(mockRequests[0]).toEqual({ page: 2, limit: 20 });
  expect(view.rows()).toBe("a1");
  expect(view.pagination().dataset.page).toBe("2");
  expect(view.pagination().dataset.total).toBe("3");
});

it("has a single page for an empty list", () => {
  mockTotalCount = 0;
  const view = render();

  expect(view.pagination().dataset.total).toBe("1");
});

it("moves a saved page past the last page back to the last page", () => {
  mockSavedPage = 7;
  mockItems = [];
  render();

  expect(mockSetPage).toHaveBeenCalledWith(3);
});

it("does not clamp the page against stale previous-page data", () => {
  mockSavedPage = 7;
  mockIsPreviousData = true;
  render();

  expect(mockSetPage).not.toHaveBeenCalled();
});

it("does not reset a valid saved page", () => {
  mockSavedPage = 3;
  render();

  expect(mockSetPage).not.toHaveBeenCalled();
});

it("clamps page changes to the last page", () => {
  const view = render();

  act(() => view.pagination().click());

  expect(mockSetPage).toHaveBeenCalledWith(3);
});
