/**
 * @jest-environment jsdom
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { TokenListSortOption } from "@/common/types/token";
import StandardNetworkTokensData from "./StandardNetworkTokensData";

const mockFetchNextPage = jest.fn();
let mockPage: { hasNextPage: boolean; isFetchingNextPage: boolean };

jest.mock("@/common/services/token/use-mapped-api-tokens", () => ({
  useMappedApiTokens: () => ({ data: [], isFetched: true, fetchNextPage: mockFetchNextPage, ...mockPage }),
}));
jest.mock("@/common/hooks/common/use-token-price", () => ({
  useTokenPrice: () => ({ getPriceEntry: () => null }),
}));
jest.mock("../token-list-table/standard-network-token-list-table/StandardNetworkTokenListTable", () => ({
  StandardNetworkTokenListTable: () => null,
}));

const sortOption: TokenListSortOption = { field: "marketCap", order: "desc" };

it("keeps loading pages until every token is loaded for a client side sort", () => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  const root = createRoot(document.createElement("div"));
  const render = (page: typeof mockPage) => {
    mockPage = page;
    act(() => root.render(<StandardNetworkTokensData sortOption={sortOption} setSortOption={jest.fn()} />));
  };

  render({ hasNextPage: true, isFetchingNextPage: false });
  expect(mockFetchNextPage).toHaveBeenCalledTimes(1);

  render({ hasNextPage: true, isFetchingNextPage: true });
  expect(mockFetchNextPage).toHaveBeenCalledTimes(1);

  // Page 2 loaded and still reports a successor.
  render({ hasNextPage: true, isFetchingNextPage: false });
  expect(mockFetchNextPage).toHaveBeenCalledTimes(2);

  render({ hasNextPage: true, isFetchingNextPage: true });
  render({ hasNextPage: false, isFetchingNextPage: false });
  expect(mockFetchNextPage).toHaveBeenCalledTimes(2);

  act(() => root.unmount());
});
