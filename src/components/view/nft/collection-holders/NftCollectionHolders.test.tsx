/**
 * @jest-environment jsdom
 */
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { act } from "react-dom/test-utils";
import NftCollectionHolders from "./NftCollectionHolders";

const mockUseGetRealmHoldersByPath = jest.fn();
let mockPageState = { scope: "", page: 1 };

jest.mock("@/common/react-query/realm/api", () => ({
  useGetRealmHoldersByPath: (...args: unknown[]) => mockUseGetRealmHoldersByPath(...args),
}));
jest.mock("@/common/hooks/provider/use-network-provider", () => ({
  useNetworkProvider: () => ({ currentNetwork: { chainId: "test" } }),
}));
jest.mock("@/common/hooks/detail-tabs/use-history-entry-state", () => ({
  useHistoryEntryState: () => [mockPageState, jest.fn()],
}));
jest.mock("@/components/view/common/list-pagination/ListPagination", () => ({ ListPagination: () => null }));
jest.mock("../../datatable", () => ({ DatatableItem: {} }));
jest.mock("../../common/table-skeleton/TableSkeleton", () => ({ __esModule: true, default: () => null }));

const mockDatatable = jest.fn((_props: { datas: { rank: number }[] }) => null);
jest.mock("@/components/ui/datatable", () => {
  const Datatable = (props: { datas: { rank: number }[] }) => mockDatatable(props);
  const builder: Record<string, unknown> = {};
  const chain = new Proxy(builder, { get: () => () => chain });
  return { __esModule: true, default: Datatable, DatatableOption: { Builder: { builder: () => chain } } };
});

let root: Root;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  mockDatatable.mockClear();
  mockUseGetRealmHoldersByPath.mockReset();
  root = createRoot(document.createElement("div"));
});
afterEach(() => act(() => root.unmount()));

it("requests the saved page and keeps the rank counting across pages", () => {
  mockPageState = { scope: "gno.land/r/nft", page: 3 };
  mockUseGetRealmHoldersByPath.mockReturnValue({
    data: {
      items: [
        { address: "g1a", tokenCount: 2, percentage: 1 },
        { address: "g1b", tokenCount: 1, percentage: 0.5 },
      ],
      page: { hasNext: false, totalCount: 82 },
    },
    isFetched: true,
    isPreviousData: false,
  });

  act(() => root.render(<NftCollectionHolders tokenKey="gno.land/r/nft" />));

  expect(mockUseGetRealmHoldersByPath).toHaveBeenCalledWith({ path: "gno.land/r/nft", page: 3 });
  expect(mockDatatable.mock.calls[0][0].datas.map(row => row.rank)).toEqual([81, 82]);
});
