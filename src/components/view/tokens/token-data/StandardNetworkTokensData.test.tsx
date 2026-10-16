/**
 * @jest-environment jsdom
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { TokenListSortOption } from "@/common/types/token";
import StandardNetworkTokensData from "./StandardNetworkTokensData";

const mockFetchNextPage = jest.fn();
let mockPage: { data: unknown[]; hasNextPage: boolean; isFetchingNextPage: boolean; isError?: boolean };

jest.mock("@/common/services/token/use-mapped-api-tokens", () => ({
  useMappedApiTokens: () => ({ isFetched: true, fetchNextPage: mockFetchNextPage, ...mockPage }),
}));
jest.mock("@/common/hooks/common/use-token-price", () => ({
  useTokenPrice: () => ({ getPriceEntry: () => null }),
}));
jest.mock("../token-list-table/standard-network-token-list-table/StandardNetworkTokenListTable", () => ({
  StandardNetworkTokenListTable: () => null,
}));

const sortOption: TokenListSortOption = { field: "marketCap", order: "desc" };
const page1: unknown[] = [];
const page2: unknown[] = [];

let root: ReturnType<typeof createRoot>;
const render = (page: typeof mockPage) => {
  mockPage = page;
  act(() => root.render(<StandardNetworkTokensData sortOption={sortOption} setSortOption={jest.fn()} />));
};

beforeEach(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  mockFetchNextPage.mockClear();
  root = createRoot(document.createElement("div"));
});
afterEach(() => act(() => root.unmount()));

it("keeps loading pages until every token is loaded for a client side sort", () => {
  render({ data: page1, hasNextPage: true, isFetchingNextPage: false });
  expect(mockFetchNextPage).toHaveBeenCalledTimes(1);

  render({ data: page1, hasNextPage: true, isFetchingNextPage: true });
  expect(mockFetchNextPage).toHaveBeenCalledTimes(1);

  // Page 2 loaded and still reports a successor.
  render({ data: page2, hasNextPage: true, isFetchingNextPage: false });
  expect(mockFetchNextPage).toHaveBeenCalledTimes(2);

  render({ data: page2, hasNextPage: true, isFetchingNextPage: true });
  render({ data: page2, hasNextPage: false, isFetchingNextPage: false });
  expect(mockFetchNextPage).toHaveBeenCalledTimes(2);
});

it("loads the next page even when the in-flight render is batched away", () => {
  render({ data: page1, hasNextPage: true, isFetchingNextPage: false });
  // A fast response: React never renders isFetchingNextPage=true, only the new page.
  render({ data: page2, hasNextPage: true, isFetchingNextPage: false });
  expect(mockFetchNextPage).toHaveBeenCalledTimes(2);
});

it("stops loading after a next page request fails", () => {
  render({ data: page1, hasNextPage: true, isFetchingNextPage: false, isError: true });
  expect(mockFetchNextPage).not.toHaveBeenCalled();
});
