/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";

import theme from "@/styles/theme";
import { TransactionFunctionSearch } from "./TransactionFunctionSearch";

const mockUseGetNames = jest.fn();
jest.mock("@/common/react-query/transaction/api", () => ({
  useGetTransactionFunctionNames: (...args: unknown[]) => mockUseGetNames(...args),
}));
jest.mock("@/assets/svgs/icon-nft-search.svg", () => () => null);

const SUGGESTIONS = { data: { items: [{ name: "Swap" }, { name: "SwapRoute" }] }, isLoading: false };

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;
const onApply = jest.fn();

const input = () => container.querySelector("input")!;
const options = () => Array.from(container.querySelectorAll<HTMLElement>("[data-search-option]"));

// Sets the value through the native setter so React sees the change.
function type(value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
  act(() => {
    setter.call(input(), value);
    input().dispatchEvent(new Event("input", { bubbles: true }));
  });
}

function press(key: string) {
  act(() => {
    input().dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
  });
}

// Waits out the keyword debounce.
const settle = () => act(() => void jest.advanceTimersByTime(300));

beforeAll(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  Element.prototype.scrollIntoView = jest.fn();
});

beforeEach(() => {
  jest.useFakeTimers();
  onApply.mockReset();
  mockUseGetNames.mockReset().mockReturnValue(SUGGESTIONS);
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() =>
    root.render(
      <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
        <TransactionFunctionSearch onApply={onApply} />
      </ThemeProvider>,
    ),
  );
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  jest.useRealTimers();
});

describe("TransactionFunctionSearch", () => {
  it("lists the suggestions for the debounced keyword", () => {
    type("  sw ");
    expect(options()).toHaveLength(0);

    settle();

    expect(mockUseGetNames).toHaveBeenLastCalledWith({ keyword: "sw" }, { enabled: true });
    expect(options().map(option => option.textContent)).toEqual(["Swap", "SwapRoute"]);
  });

  it("filters by the exact label of a clicked suggestion and closes the list", () => {
    type("sw");
    settle();

    act(() => options()[1].click());

    expect(onApply).toHaveBeenCalledWith({ function: "SwapRoute" });
    expect(input().value).toBe("SwapRoute");
    expect(options()).toHaveLength(0);
  });

  it("filters by the highlighted suggestion on Enter, not by the typed text", () => {
    type("sw");
    settle();

    press("ArrowDown");
    press("Enter");

    expect(onApply).toHaveBeenCalledTimes(1);
    expect(onApply).toHaveBeenCalledWith({ function: "Swap" });
  });

  it("filters by the trimmed typed text on Enter without a highlighted suggestion", () => {
    type(" sw ");
    settle();

    press("Enter");

    expect(onApply).toHaveBeenCalledTimes(1);
    expect(onApply).toHaveBeenCalledWith({ functionKeyword: "sw" });
    expect(options()).toHaveLength(0);
  });

  it("clears the filter when the input is emptied", () => {
    type("sw");
    settle();
    onApply.mockClear();

    type("");

    expect(onApply).toHaveBeenCalledWith(undefined);
    expect(options()).toHaveLength(0);
  });

  it("never shows suggestions of an older keyword while the new one is debouncing", () => {
    type("sw");
    settle();
    type("swap2");

    expect(options()).toHaveLength(0);
    expect(container.textContent).toContain("Loading...");
  });

  it("limits the input to the 256 characters the API accepts", () => {
    expect(input().maxLength).toBe(256);
  });
});
