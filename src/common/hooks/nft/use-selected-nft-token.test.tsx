/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

import { useSelectedNftToken } from "./use-selected-nft-token";

const mockListeners = new Map<string, Set<() => void>>();
const mockEvents = {
  on: (event: string, listener: () => void) => {
    if (!mockListeners.has(event)) mockListeners.set(event, new Set());
    mockListeners.get(event)!.add(listener);
  },
  off: (event: string, listener: () => void) => mockListeners.get(event)?.delete(listener),
};
jest.mock("next/router", () => ({ useRouter: () => ({ events: mockEvents }) }));

function mountSelection() {
  const container = document.createElement("div");
  const root = createRoot(container);
  let selection!: readonly [string | null, (id: string | null) => void];
  function Probe() {
    selection = useSelectedNftToken();
    return <output>{selection[0] ?? "closed"}</output>;
  }
  act(() => root.render(<Probe />));
  return {
    selected: () => container.textContent,
    select: (id: string | null) => act(() => selection[1](id)),
    unmount: () => act(() => root.unmount()),
  };
}
function navigate(url: string, event: string) {
  act(() => {
    window.history.pushState({}, "", url);
    mockListeners.get(event)?.forEach(listener => listener());
  });
}

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  mockListeners.clear();
  window.history.replaceState({}, "", "/tokens/a#inventory&tokenId=1");
});

it("replaces the selected NFT and closes it when a client-side destination has no token hash", () => {
  const view = mountSelection();
  try {
    expect(view.selected()).toBe("1");
    navigate("/tokens/b#inventory&tokenId=2", "routeChangeComplete");
    expect(view.selected()).toBe("2");
    navigate("/tokens/c", "routeChangeComplete");
    expect(view.selected()).toBe("closed");
  } finally {
    view.unmount();
  }
});

it("follows Next hash navigation after a card selection without reverting that selection", () => {
  const view = mountSelection();
  try {
    view.select("3");
    expect(view.selected()).toBe("3");
    expect(window.location.hash).toBe("#inventory&tokenId=3");
    navigate("/tokens/a#inventory&tokenId=4", "hashChangeComplete");
    expect(view.selected()).toBe("4");
    view.select(null);
    expect(view.selected()).toBe("closed");
    expect(window.location.hash).toBe("#inventory");
  } finally {
    view.unmount();
  }
});

it("continues following native hash navigation", () => {
  const view = mountSelection();
  try {
    act(() => {
      window.history.replaceState({}, "", "/tokens/a#inventory&tokenId=5");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect(view.selected()).toBe("5");
  } finally {
    view.unmount();
  }
});
