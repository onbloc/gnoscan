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
    wrapperRef,
  }: {
    page: number;
    totalPages?: number;
    onChangePage: (page: number) => void;
    wrapperRef?: React.Ref<HTMLButtonElement>;
  }) => <button ref={wrapperRef} data-page={page} data-total={totalPages} onClick={() => onChangePage(99)} />,
}));

const onChangePage = jest.fn();
const scrollTo = jest.fn();
// Where the footer and the scroll are on screen.
let footerTop = 0;
let scrollY = 0;

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
  // jsdom cannot lay out the page: the footer is where the test says.
  const button = () => container.querySelector("button") as HTMLButtonElement;
  button().getBoundingClientRect = () => ({ top: footerTop } as DOMRect);
  return { button, update };
}

function render(props: Partial<React.ComponentProps<typeof ListPagination>> = {}) {
  return renderWithUpdates(props).button();
}

beforeAll(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  Object.defineProperty(window, "scrollTo", { configurable: true, value: scrollTo });
  Object.defineProperty(window, "scrollY", { configurable: true, get: () => scrollY });
});

beforeEach(() => {
  jest.clearAllMocks();
  footerTop = 0;
  scrollY = 0;
});

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

describe("keeping the footer in place", () => {
  // The mock footer asks for page 99, which is the last page (3).
  const chooseLastPage = (button: HTMLButtonElement) => act(() => button.click());

  it("scrolls by how far the footer was pushed when the chosen page replaces the rows", () => {
    scrollY = 1104;
    footerTop = 674;
    const view = renderWithUpdates({ page: 1 });
    chooseLastPage(view.button());

    footerTop = 2456;
    view.update({ page: 3 });
    expect(scrollTo).toHaveBeenCalledWith(0, 1104 + 2456 - 674);
  });

  it("leaves the scroll alone when the footer did not move", () => {
    scrollY = 1104;
    footerTop = 674;
    const view = renderWithUpdates({ page: 1 });
    chooseLastPage(view.button());

    view.update({ page: 3 });
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("waits for the rows of the chosen page while the previous ones are still shown", () => {
    scrollY = 1104;
    footerTop = 674;
    const view = renderWithUpdates({ page: 1 });
    chooseLastPage(view.button());

    footerTop = 2456;
    view.update({ page: 3, isSettled: false });
    expect(scrollTo).not.toHaveBeenCalled();

    view.update({ page: 3, isSettled: true });
    expect(scrollTo).toHaveBeenCalledTimes(1);
  });

  it("does not move the scroll for a page that was not chosen with the footer", () => {
    scrollY = 1104;
    footerTop = 674;
    const view = renderWithUpdates({ page: 1 });

    footerTop = 2456;
    view.update({ page: 3 });
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("forgets a choice that ended on another page", () => {
    scrollY = 1104;
    footerTop = 674;
    const view = renderWithUpdates({ page: 1 });
    chooseLastPage(view.button());

    footerTop = 2456;
    view.update({ page: 2 });
    view.update({ page: 3 });
    expect(scrollTo).not.toHaveBeenCalled();
  });
});
