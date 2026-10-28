/**
 * @jest-environment jsdom
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "styled-components";

import theme from "@/styles/theme";
import { FunctionNameCombobox, matchFunctionNames } from "./FunctionNameCombobox";

jest.mock("@/states", () => {
  const { atom } = jest.requireActual("recoil");
  return { themeState: atom({ key: "themeState", default: "light" }) };
});

const NAMES = [
  { name: "Heartbeat", packagePath: "gno.land/r/demo/game", count: 82517 },
  { name: "Transfer", packagePath: "gno.land/r/demo/foo", count: 900 },
  { name: "TransferFrom", packagePath: "gno.land/r/demo/foo", count: 300 },
];

describe("matchFunctionNames", () => {
  it("matches a substring regardless of case and keeps the order", () => {
    expect(matchFunctionNames(NAMES, "TRANSFER").map(n => n.name)).toEqual(["Transfer", "TransferFrom"]);
    expect(matchFunctionNames(NAMES, " beat ").map(n => n.name)).toEqual(["Heartbeat"]);
    expect(matchFunctionNames(NAMES, "").length).toBe(3);
  });
});

describe("FunctionNameCombobox", () => {
  it("picks a suggestion with the keyboard", () => {
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    // jsdom has no scrolling; the list scrolls the active option into view.
    const scrollIntoView = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    const onChange = jest.fn();

    act(() =>
      root.render(
        <RecoilRoot>
          <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
            <FunctionNameCombobox value="transfer" packagePath="" onChange={onChange} functionNames={NAMES} />
          </ThemeProvider>
        </RecoilRoot>,
      ),
    );
    const input = container.querySelector("input")!;
    const key = (k: string) => act(() => input.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true })));

    act(() => input.focus());
    expect(container.querySelectorAll("[role=option]").length).toBe(2);

    key("ArrowDown");
    key("ArrowDown");
    expect(input.getAttribute("aria-activedescendant")).toBe(container.querySelectorAll("[role=option]")[1].id);
    expect(scrollIntoView).toHaveBeenLastCalledWith({ block: "nearest" });

    key("Enter");
    expect(onChange).toHaveBeenCalledWith("TransferFrom", "gno.land/r/demo/foo");
    expect(container.querySelector("[role=listbox]")).toBeNull();

    act(() => root.unmount());
    container.remove();
  });
});
