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
    totalPages?: number;
    onChangePage: (page: number) => void;
  }) => <button data-page={page} data-total={totalPages} onClick={() => onChangePage(99)} />,
}));

const onChangePage = jest.fn();

function renderWithUpdates(props: Partial<React.ComponentProps<typeof ListPagination>> = {}) {
  const container = document.createElement("div");
  const root = createRoot(container);
  const update = (next: Partial<React.ComponentProps<typeof ListPagination>>) =>
    act(() =>
      root.render(
        <ListPagination
          page={1}
          pageSize={40}
          scope=""
          totalCount={100}
          isSettled
          onChangePage={onChangePage}
          {...props}
          {...next}
        />,
      ),
    );
  update({});
  return { button: () => container.querySelector("button") as HTMLButtonElement, update };
}

function render(props: Partial<React.ComponentProps<typeof ListPagination>> = {}) {
  return renderWithUpdates(props).button();
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

describe("when a later response is missing", () => {
  it("keeps the page count of the last response", () => {
    const view = renderWithUpdates({ page: 3 });
    expect(view.button().dataset.total).toBe("3");

    view.update({ totalCount: undefined });
    expect(view.button().dataset.total).toBe("3");
  });

  it("keeps the page count when the request fails after rows of the previous page were shown", () => {
    const view = renderWithUpdates({ page: 1 });

    view.update({ page: 2, isSettled: false });
    view.update({ page: 2, totalCount: undefined, isSettled: true });
    expect(view.button().dataset.total).toBe("3");
  });

  it("does not move the page while only the remembered total is known", () => {
    const view = renderWithUpdates({ page: 7, totalCount: 40 });
    onChangePage.mockClear();

    view.update({ totalCount: undefined });
    expect(onChangePage).not.toHaveBeenCalled();
  });

  it("has no page count when no response was ever received", () => {
    expect(render({ totalCount: undefined }).dataset.total).toBeUndefined();
  });

  it("does not remember the total of rows that belong to a previous query", () => {
    const view = renderWithUpdates({ isSettled: false });

    view.update({ totalCount: undefined });
    expect(view.button().dataset.total).toBeUndefined();
  });

  it("forgets the total when the scope changes", () => {
    const view = renderWithUpdates({ scope: "name:asc:" });

    view.update({ scope: "name:asc:abc", totalCount: undefined });
    expect(view.button().dataset.total).toBeUndefined();
  });
});
