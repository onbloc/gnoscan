/** @jest-environment jsdom */
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

import TokenListContainer from "./tokens/token-list-container/TokenListContainer";
import RealmListContainer from "./realms/realm-list-container/RealmListContainer";
import NftCollectionListContainer from "./nft-collections/nft-collection-list-container/NftCollectionListContainer";

let mockChainId = "chain-a";
const mockMounts: string[] = [];

jest.mock("@/common/hooks/provider/use-network-provider", () => ({
  useNetworkProvider: () => ({ currentNetwork: { chainId: mockChainId }, isCustomNetwork: false }),
}));
jest.mock("@/common/hooks/detail-tabs/use-history-entry-state", () => ({
  useHistoryEntryState: (_key: string, initial: unknown) => [initial, jest.fn()],
}));

function mockData(name: string) {
  return function MockListData() {
    useEffect(() => {
      mockMounts.push(name);
    }, []);
    return null;
  };
}
jest.mock("@/components/view/tokens/token-data/StandardNetworkTokensData", () => mockData("tokens"));
jest.mock("@/components/view/tokens/token-data/CustomNetworkTokensData", () => () => null);
jest.mock("@/components/view/realms/realm-data/StandardNetworkRealmsData", () => mockData("realms"));
jest.mock("@/components/view/realms/realm-data/CustomNetworkRealmsData", () => () => null);
jest.mock("@/components/view/nft-collections/nft-collection-data/StandardNetworkNftCollectionsData", () =>
  mockData("nfts"),
);
jest.mock("@/components/view/list-summary/ListSearch", () => ({
  ListSearch: () => null,
  useListKeyword: () => ({ value: "", setValue: jest.fn(), keyword: undefined }),
}));

beforeAll(() => Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }));

it.each([
  ["tokens", TokenListContainer],
  ["realms", RealmListContainer],
  ["nfts", NftCollectionListContainer],
])("remounts the %s list on a network change so kept rows do not carry over", (name, Container) => {
  mockChainId = "chain-a";
  mockMounts.length = 0;
  const root = createRoot(document.createElement("div"));
  act(() => root.render(<Container />));
  act(() => root.render(<Container />));
  mockChainId = "chain-b";
  act(() => root.render(<Container />));
  act(() => root.unmount());

  expect(mockMounts).toEqual([name, name]);
});
