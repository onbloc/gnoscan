/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

import { ListPagination } from "./ListPagination";

jest.mock("@/components/ui/pagination", () => ({
  Pagination: ({
    page,
    totalPages,
    onChangePage,
  }: {
    page: number;
    totalPages: number;
    onChangePage: (page: number) => void;
  }) => <button data-page={page} data-total={totalPages} onClick={() => onChangePage(99)} />,
}));

const onChangePage = jest.fn();

function render(props: Partial<React.ComponentProps<typeof ListPagination>> = {}) {
  const container = document.createElement("div");
  const root = createRoot(container);
  act(() =>
    root.render(
      <ListPagination page={1} pageSize={40} totalCount={100} isSettled onChangePage={onChangePage} {...props} />,
    ),
  );
  return container.querySelector("button") as HTMLButtonElement;
}

beforeAll(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
});

beforeEach(() => jest.clearAllMocks());

it("derives the page count from totalCount and the page size", () => {
  expect(render({ totalCount: 81 }).dataset.total).toBe("3");
  expect(render({ totalCount: 80 }).dataset.total).toBe("2");
});

it("has a single page for an empty list", () => {
  expect(render({ totalCount: 0 }).dataset.total).toBe("1");
});

it("clamps a requested page to the last page", () => {
  const button = render();
  act(() => button.click());

  expect(onChangePage).toHaveBeenCalledWith(3);
});

it("moves a saved page past the last page back to the last page", () => {
  render({ page: 7 });

  expect(onChangePage).toHaveBeenCalledWith(3);
});

it("keeps the page while rows of a previous query are shown", () => {
  render({ page: 7, isSettled: false });

  expect(onChangePage).not.toHaveBeenCalled();
});

it("keeps the page until the total count is known", () => {
  render({ page: 7, totalCount: undefined });

  expect(onChangePage).not.toHaveBeenCalled();
});
