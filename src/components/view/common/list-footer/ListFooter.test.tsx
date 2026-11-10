/** @jest-environment jsdom */
import React from "react";
import { Root, createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";

import theme from "@/styles/theme";
import { ListFooter } from "./ListFooter";

jest.mock("@/assets/svgs/icon-chevron.svg", () => () => null);
jest.mock("../list-pagination/ListPagination", () => ({ ListPagination: () => null }));

let container: HTMLDivElement;
let root: Root;
const onChangePageSize = jest.fn();

const render = () =>
  act(() =>
    root.render(
      <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
        <ListFooter
          page={2}
          pageSize={50}
          totalCount={400}
          hasNext
          isSettled
          scope=""
          onChangePage={jest.fn()}
          onChangePageSize={onChangePageSize}
        />
      </ThemeProvider>,
    ),
  );

const trigger = () => container.querySelector<HTMLButtonElement>("button[aria-haspopup=menu]")!;
const options = () => Array.from(container.querySelectorAll<HTMLButtonElement>("[role=menuitemradio]"));

beforeAll(() => Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }));

beforeEach(() => {
  onChangePageSize.mockReset();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe("ListFooter", () => {
  it("shows the rows per page in use, and lists 10, 25, 50 and 100 once opened", () => {
    render();
    expect(trigger().textContent).toContain("50");
    expect(options()).toHaveLength(0);

    act(() => trigger().click());

    expect(options().map(option => option.textContent)).toEqual(["10", "25", "50", "100"]);
    expect(options().map(option => option.getAttribute("aria-checked"))).toEqual(["false", "false", "true", "false"]);
  });

  it("reports another size and closes, but not the size in use", () => {
    render();

    act(() => trigger().click());
    act(() => options()[2].click());
    expect(onChangePageSize).not.toHaveBeenCalled();
    expect(options()).toHaveLength(0);

    act(() => trigger().click());
    act(() => options()[3].click());
    expect(onChangePageSize).toHaveBeenCalledWith(100);
    expect(options()).toHaveLength(0);
  });

  it("closes on Escape and on a click outside", () => {
    render();

    act(() => trigger().click());
    act(() => {
      trigger().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(options()).toHaveLength(0);

    act(() => trigger().click());
    act(() => {
      document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });
    expect(options()).toHaveLength(0);
  });
});
