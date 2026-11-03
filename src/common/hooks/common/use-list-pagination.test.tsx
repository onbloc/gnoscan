/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

import { useListPagination } from "./use-list-pagination";

let mockChainId = "chain-a";

jest.mock("@/common/hooks/provider/use-network-provider", () => ({
  useNetworkProvider: () => ({ currentNetwork: { chainId: mockChainId } }),
}));
jest.mock("@/common/hooks/detail-tabs/use-history-entry-state", () => {
  const { useState } = jest.requireActual("react");
  const store = new Map<string, unknown>();
  return {
    useHistoryEntryState: (name: string, initial: unknown) => {
      const [, rerender] = useState(0);
      return [
        store.has(name) ? store.get(name) : initial,
        (value: unknown) => {
          store.set(name, value);
          rerender((n: number) => n + 1);
        },
      ];
    },
    __store: store,
  };
});

let current: ReturnType<typeof useListPagination>;
const Probe = ({ scope }: { scope?: string }) => {
  current = useListPagination("list", scope);
  return null;
};

let root: ReturnType<typeof createRoot>;
const render = (scope?: string) => act(() => root.render(<Probe scope={scope} />));

beforeAll(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
});

beforeEach(() => {
  mockChainId = "chain-a";
  jest.requireMock("@/common/hooks/detail-tabs/use-history-entry-state").__store.clear();
  root = createRoot(document.createElement("div"));
});

afterEach(() => act(() => root.unmount()));

it("starts on page 1 and keeps the chosen page", () => {
  render("holders:desc");
  expect(current[0]).toBe(1);

  act(() => current[1](3));
  expect(current[0]).toBe(3);
});

it("goes back to page 1 when the scope changes", () => {
  render("holders:desc");
  act(() => current[1](3));

  render("holders:asc");
  expect(current[0]).toBe(1);
});

it("restores the page when the original scope returns before another page is chosen", () => {
  render("holders:desc");
  act(() => current[1](3));
  render("holders:asc");
  render("holders:desc");

  expect(current[0]).toBe(3);
});

it("starts each network on page 1", () => {
  render();
  act(() => current[1](4));

  mockChainId = "chain-b";
  render();
  expect(current[0]).toBe(1);
});
