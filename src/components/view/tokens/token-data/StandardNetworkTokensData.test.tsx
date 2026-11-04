/**
 * @jest-environment jsdom
 */
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { TokenListSortOption } from "@/common/types/token";
import StandardNetworkTokensData from "./StandardNetworkTokensData";

const mockUseMappedApiTokens = jest.fn();
let mockPageState = { scope: "", page: 1 };
const mockSetState = jest.fn((next: typeof mockPageState) => {
  mockPageState = next;
});

jest.mock("@/common/services/token/use-mapped-api-tokens", () => ({
  useMappedApiTokens: (...args: unknown[]) => mockUseMappedApiTokens(...args),
}));
jest.mock("@/common/hooks/common/use-token-price", () => ({
  useTokenPrice: () => ({ getPriceEntry: () => null }),
}));
jest.mock("@/common/hooks/provider/use-network-provider", () => ({
  useNetworkProvider: () => ({ currentNetwork: { chainId: "test" } }),
}));
jest.mock("@/common/hooks/detail-tabs/use-history-entry-state", () => ({
  useHistoryEntryState: () => [mockPageState, mockSetState],
}));
jest.mock("@/components/view/common/list-pagination/ListPagination", () => ({ ListPagination: () => null }));
jest.mock("../token-list-table/standard-network-token-list-table/StandardNetworkTokenListTable", () => ({
  StandardNetworkTokenListTable: () => null,
}));

let root: Root;
const render = (sortOption: TokenListSortOption, keyword?: string) =>
  act(() =>
    root.render(<StandardNetworkTokensData sortOption={sortOption} setSortOption={jest.fn()} keyword={keyword} />),
  );

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  mockPageState = { scope: "", page: 1 };
  mockUseMappedApiTokens.mockReset();
  mockUseMappedApiTokens.mockReturnValue({
    data: [],
    isFetched: true,
    isLoading: false,
    isError: false,
    isPreviousData: false,
    hasNext: false,
    totalCount: 0,
  });
  root = createRoot(document.createElement("div"));
});
afterEach(() => act(() => root.unmount()));

it("requests the saved page with the server sort of the selected column", () => {
  mockPageState = { scope: "marketCap:desc:", page: 3 };
  render({ field: "marketCap", order: "desc" });

  expect(mockUseMappedApiTokens).toHaveBeenLastCalledWith({
    sort: "marketCap",
    order: "desc",
    keyword: undefined,
    page: 3,
  });
});

it("starts again from page 1 when the sort or keyword changes", () => {
  mockPageState = { scope: "holders:desc:", page: 3 };

  render({ field: "holders", order: "desc" });
  expect(mockUseMappedApiTokens).toHaveBeenLastCalledWith(expect.objectContaining({ page: 3 }));

  render({ field: "totalSupply", order: "asc" });
  expect(mockUseMappedApiTokens).toHaveBeenLastCalledWith(
    expect.objectContaining({ sort: "totalSupply", order: "asc", page: 1 }),
  );

  render({ field: "holders", order: "desc" }, "gns");
  expect(mockUseMappedApiTokens).toHaveBeenLastCalledWith(expect.objectContaining({ keyword: "gns", page: 1 }));
});
