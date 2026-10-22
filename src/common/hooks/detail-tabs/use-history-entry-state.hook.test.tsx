/** @jest-environment jsdom */
import { SetStateAction, useEffect } from "react";
import { createRoot, Root } from "react-dom/client";
import { act } from "react-dom/test-utils";

import { readHistoryEntryState, useHistoryEntryState } from "./use-history-entry-state";

type Setter = (action: SetStateAction<number>) => void;

const NAME = "test:page";
let rendered: { value: number; setValue: Setter };

function Counter() {
  const [value, setValue] = useHistoryEntryState(NAME, 0);
  useEffect(() => {
    rendered = { value, setValue };
  });
  return null;
}

const roots: Root[] = [];
function mount() {
  const root = createRoot(document.createElement("div"));
  roots.push(root);
  act(() => root.render(<Counter />));
  return root;
}

// Next.js stamps each history entry with a unique `key`.
const visit = (key: string) => window.history.pushState({ key }, "");

beforeAll(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  // The first mount keeps server defaults for hydration, later mounts read storage.
  mount();
});

beforeEach(() => window.sessionStorage.clear());

afterEach(() => {
  roots.splice(0).forEach(root => act(() => root.unmount()));
});

it("composes two updater calls in one event", () => {
  visit("entry-a");
  mount();
  act(() => {
    rendered.setValue(page => page + 1);
    rendered.setValue(page => page + 1);
  });
  expect(rendered.value).toBe(2);
  expect(readHistoryEntryState(NAME, 0, "entry-a")).toBe(2);
});

it("applies a late updater to the originating entry's stored value", () => {
  visit("entry-a");
  const root = mount();
  act(() => rendered.setValue(5));
  const setOnEntryA = rendered.setValue;

  visit("entry-b");
  act(() => root.render(<Counter />));
  expect(rendered.value).toBe(0);

  act(() => setOnEntryA(page => page + 1));
  expect(readHistoryEntryState(NAME, 0, "entry-a")).toBe(6);
  expect(readHistoryEntryState(NAME, -1, "entry-b")).toBe(-1);
  expect(rendered.value).toBe(0);
});

it("restores an updater's value on the same entry only", () => {
  visit("entry-a");
  const root = mount();
  act(() => rendered.setValue(page => page + 3));
  act(() => root.unmount());

  mount();
  expect(rendered.value).toBe(3);

  visit("entry-b");
  mount();
  expect(rendered.value).toBe(0);
});
