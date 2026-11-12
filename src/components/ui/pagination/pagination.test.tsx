/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";

import theme from "@/styles/theme";
import { Pagination } from "./pagination";

jest.mock("@/assets/svgs/icon-pagination-first.svg", () => () => null);
jest.mock("@/assets/svgs/icon-pagination-previous.svg", () => () => null);

const onChangePage = jest.fn();

function render(props: Partial<React.ComponentProps<typeof Pagination>> = {}) {
  const container = document.createElement("div");
  const root = createRoot(container);
  act(() =>
    root.render(
      <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
        <Pagination page={1} onChangePage={onChangePage} {...props} />
      </ThemeProvider>,
    ),
  );
  const button = (label: string) =>
    container.querySelector(`button[aria-label='${label}']`) as HTMLButtonElement | null;
  return { container, button };
}

beforeAll(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
});

beforeEach(() => jest.clearAllMocks());

describe("with a known total", () => {
  it("shows the page of the total and moves to the last page", () => {
    const view = render({ page: 2, totalPages: 5 });

    expect(view.container.textContent).toContain("Page 2 of 5");
    act(() => view.button("Last page")!.click());
    expect(onChangePage).toHaveBeenCalledWith(5);
  });

  it("renders nothing for a single page", () => {
    expect(render({ totalPages: 1 }).container.textContent).toBe("");
  });
});

describe("with an unknown total", () => {
  it("shows only the current page and lets the user go back", () => {
    const view = render({ page: 7 });

    expect(view.container.textContent).toContain("Page 7");
    expect(view.container.textContent).not.toContain(" of ");
    act(() => view.button("Previous page")!.click());
    expect(onChangePage).toHaveBeenCalledWith(6);
    act(() => view.button("First page")!.click());
    expect(onChangePage).toHaveBeenCalledWith(1);
  });

  it("offers no last page and no next page unless the next page is known to exist", () => {
    expect(render({ page: 7 }).button("Last page")).toBeNull();
    expect(render({ page: 7 }).button("Next page")!.disabled).toBe(true);
    expect(render({ page: 7, hasNext: true }).button("Next page")!.disabled).toBe(false);
  });

  it("renders nothing on the first page, where there is nowhere to go", () => {
    expect(render({ page: 1 }).container.textContent).toBe("");
  });
});
