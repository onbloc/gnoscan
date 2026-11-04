/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

import { useActivityEvents } from "./use-activity-events";

const mockUsePagedList = jest.fn();
jest.mock("@/common/hooks/common/use-paged-list", () => ({
  usePagedList: (...args: unknown[]) => mockUsePagedList(...args),
}));
jest.mock("@/common/hooks/detail-tabs/use-history-entry-state", () => {
  const { useState } = jest.requireActual("react");
  return { useHistoryEntryState: (_name: string, initial: unknown) => useState(initial) };
});
jest.mock("@/common/mapper/realm/realm-mapper", () => ({
  RealmMapper: { realmEventFromApiResponses: (items: unknown[]) => items },
}));

const query = jest.fn();

let current: ReturnType<typeof useActivityEvents>;
const Probe = () => {
  current = useActivityEvents("realm", "gno.land/r/demo", query);
  return null;
};

beforeAll(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
});

beforeEach(() => {
  mockUsePagedList.mockReset();
  mockUsePagedList.mockReturnValue({ items: [], isFetched: true, pagination: {} });
  query.mockReset();
  query.mockReturnValue({ data: { items: [], page: { hasNext: false, totalCount: 7 } } });
});

const roots: ReturnType<typeof createRoot>[] = [];
const mount = () => {
  const root = createRoot(document.createElement("div"));
  roots.push(root);
  return root;
};

afterEach(() => {
  jest.useRealTimers();
  act(() => roots.splice(0).forEach(root => root.unmount()));
});

it("counts every event of the target for the tab badge, apart from the list filters", () => {
  const root = mount();
  act(() => root.render(<Probe />));

  expect(query).toHaveBeenCalledWith({ path: "gno.land/r/demo", includeStorage: true, page: 1, limit: 1 }, undefined);
  expect(current.allCount).toBe(7);
});

it("applies the event type to the list only after the debounce, trimmed", () => {
  jest.useFakeTimers();
  const root = mount();
  act(() => root.render(<Probe />));

  act(() => current.filterBar.onEventTypeChange("  Transfer "));
  // The input shows what is typed at once; the list is not filtered yet.
  expect(current.filterBar.eventType).toBe("  Transfer ");
  expect(mockUsePagedList.mock.lastCall?.[3].eventType).toBeUndefined();

  act(() => jest.advanceTimersByTime(299));
  expect(mockUsePagedList.mock.lastCall?.[3].eventType).toBeUndefined();

  act(() => jest.advanceTimersByTime(1));
  expect(mockUsePagedList.mock.lastCall?.[3].eventType).toBe("Transfer");
  // A new filter is a new scope, which starts again from page 1.
  expect(mockUsePagedList.mock.lastCall?.[1]).toBe("gno.land/r/demo:Transfer:false");
});
