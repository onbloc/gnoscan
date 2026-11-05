/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

import { usePagedList } from "./use-paged-list";

let mockPage = 1;
const mockSetPage = jest.fn();
jest.mock("@/common/hooks/common/use-list-pagination", () => ({
  useListPagination: () => [mockPage, mockSetPage],
}));

const query = jest.fn();

let current: ReturnType<typeof usePagedList>;
const Probe = ({ limit }: { limit?: number }) => {
  current = usePagedList("list", "gno.land/r/demo", query, { path: "gno.land/r/demo", limit });
  return null;
};

beforeAll(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
});

const roots: ReturnType<typeof createRoot>[] = [];
const mount = () => {
  const root = createRoot(document.createElement("div"));
  roots.push(root);
  return root;
};

beforeEach(() => {
  mockPage = 1;
  query.mockReset();
});

afterEach(() => {
  act(() => roots.splice(0).forEach(root => root.unmount()));
});

const render = (limit?: number) => {
  const root = mount();
  act(() => root.render(<Probe limit={limit} />));
  return root;
};

it("requests the saved page and exposes the totals for the footer and the tab count", () => {
  mockPage = 3;
  query.mockReturnValue({
    data: { items: [{ id: 1 }], page: { hasNext: true, totalCount: 130 } },
    isFetched: true,
    isPreviousData: false,
  });
  render();

  expect(query).toHaveBeenCalledWith({ path: "gno.land/r/demo", limit: undefined, page: 3 }, undefined);
  expect(current.items).toHaveLength(1);
  expect(current.pagination).toMatchObject({ page: 3, hasNext: true, totalCount: 130, isSettled: true });
});

it("is not settled while the rows of the previous page are shown", () => {
  query.mockReturnValue({
    data: { items: [], page: { hasNext: false, totalCount: 5 } },
    isFetched: true,
    isPreviousData: true,
  });
  render();

  expect(current.pagination.isSettled).toBe(false);
});

it("numbers rows and sizes pages from the same limit", () => {
  mockPage = 3;
  query.mockReturnValue({ data: undefined, isFetched: false, isPreviousData: false });

  render();
  expect(current.startIndex).toBe(80);
  expect(current.pagination.pageSize).toBe(40);

  render(100);
  expect(current.startIndex).toBe(200);
  expect(current.pagination.pageSize).toBe(100);
});

it("has no rows and no totals before the first response", () => {
  query.mockReturnValue({ data: undefined, isFetched: false, isPreviousData: false });
  render();

  expect(current.items).toEqual([]);
  expect(current.pagination.totalCount).toBeUndefined();
});

it("counts as fetched while the rows of the previous page are shown", () => {
  mockPage = 2;
  query.mockReturnValue({
    data: { items: [{ id: 1 }], page: { hasNext: true, totalCount: 80 } },
    isFetched: false,
    isPreviousData: true,
  });
  render();

  expect(current.isFetched).toBe(true);

  query.mockReturnValue({ data: undefined, isFetched: false, isPreviousData: false });
  render();

  expect(current.isFetched).toBe(false);
});

it("numbers the rows from the page on screen while the next page loads", () => {
  mockPage = 1;
  query.mockReturnValue({
    data: { items: [], page: { hasNext: true, totalCount: 80 } },
    isFetched: true,
    isPreviousData: false,
  });
  const root = mount();
  act(() => root.render(<Probe />));
  expect(current.startIndex).toBe(0);

  mockPage = 2;
  query.mockReturnValue({
    data: { items: [], page: { hasNext: false, totalCount: 80 } },
    isFetched: false,
    isPreviousData: true,
  });
  act(() => root.render(<Probe />));
  expect(current.startIndex).toBe(0);

  query.mockReturnValue({
    data: { items: [], page: { hasNext: false, totalCount: 80 } },
    isFetched: true,
    isPreviousData: false,
  });
  act(() => root.render(<Probe />));
  expect(current.startIndex).toBe(40);
});
