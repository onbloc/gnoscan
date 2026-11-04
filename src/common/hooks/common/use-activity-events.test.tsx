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

it("counts every event of the target for the tab badge, apart from the list filters", () => {
  const root = createRoot(document.createElement("div"));
  act(() => root.render(<Probe />));

  expect(query).toHaveBeenCalledWith({ path: "gno.land/r/demo", includeStorage: true, page: 1, limit: 1 }, undefined);
  expect(current.allCount).toBe(7);
});

it("lists again from page 1 when a filter changes", () => {
  const root = createRoot(document.createElement("div"));
  act(() => root.render(<Probe />));
  expect(mockUsePagedList).toHaveBeenLastCalledWith(
    "realm-events",
    "gno.land/r/demo::false",
    query,
    { path: "gno.land/r/demo", eventType: undefined, includeStorage: false },
    undefined,
  );

  act(() => current.filterBar.onIncludeStorageChange(true));

  // The page is kept per scope, so a new scope shows page 1.
  expect(mockUsePagedList.mock.lastCall?.[1]).toBe("gno.land/r/demo::true");
});
