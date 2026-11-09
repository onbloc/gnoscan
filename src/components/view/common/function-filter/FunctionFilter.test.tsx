/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";

import theme from "@/styles/theme";
import { FunctionFilterValue } from "@/common/types/function-filter";
import { ALL_FUNCTIONS, MAX_FUNCTION_LABELS } from "@/common/values/function-filter.constant";
import { FunctionFilter } from "./FunctionFilter";

const mockUseGetNames = jest.fn();
jest.mock("@/common/react-query/transaction/api", () => ({
  useGetTransactionFunctionNames: (...args: unknown[]) => mockUseGetNames(...args),
}));
jest.mock("@/components/ui/tooltip", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("@/assets/svgs/icon-tooltip.svg", () => () => null);
jest.mock("@/assets/svgs/icon-close.svg", () => () => null);
jest.mock("@/assets/svgs/icon-filter.svg", () => () => null);
jest.mock("@/assets/svgs/icon-nft-search.svg", () => () => null);

const names = (...list: string[]) => ({ data: { items: list.map(name => ({ name })) }, isLoading: false });

let container: HTMLDivElement;
let modalRoot: HTMLDivElement;
let root: ReturnType<typeof createRoot>;
const onChange = jest.fn();

const q = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
const button = (text: string) =>
  Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find(b => b.textContent?.trim() === text)!;
const allBox = () => q<HTMLInputElement>("ul input");
const optionBox = (name: string) =>
  Array.from(document.querySelectorAll<HTMLLabelElement>("ul label"))
    .find(label => label.textContent === name)!
    .querySelector("input")!;
const chips = () =>
  Array.from(document.querySelectorAll("[role=dialog] [role=group] > span > span:nth-last-child(2)")).map(
    c => c.textContent,
  );

const include = (...labels: string[]): FunctionFilterValue => ({ mode: "include", labels });
const exclude = (...labels: string[]): FunctionFilterValue => ({ mode: "exclude", labels });

const wrap = (children: React.ReactNode) => (
  <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
    {children}
  </ThemeProvider>
);

function render(filter: FunctionFilterValue) {
  act(() => root.render(wrap(<FunctionFilter filter={filter} onChange={onChange} />)));
}

// The portal finds its target in an effect, so the modal appears after a second pass.
const openModal = () => {
  act(() => q("button[aria-haspopup=dialog]").click());
  act(() => void 0);
};

beforeAll(() => Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }));

beforeEach(() => {
  jest.useFakeTimers();
  onChange.mockReset();
  mockUseGetNames.mockReset().mockReturnValue(names("Transfer", "Mint", "Swap"));
  modalRoot = document.createElement("div");
  modalRoot.id = "modal-root";
  document.body.appendChild(modalRoot);
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  modalRoot.remove();
  jest.useRealTimers();
});

describe("FunctionFilter", () => {
  it("shows the count of listed labels on the filter button", () => {
    render(exclude("Transfer", "Mint"));
    expect(container.querySelector("[aria-label='Filter, 2 excluded']")).not.toBeNull();

    render(include("Mint"));
    expect(container.querySelector("[aria-label='Filter, 1 selected']")).not.toBeNull();

    render(ALL_FUNCTIONS);
    expect(container.querySelector("[aria-label='Filter']")).not.toBeNull();
  });

  it("opens with every label checked while all transactions are listed", () => {
    render(ALL_FUNCTIONS);
    openModal();

    expect(allBox().checked).toBe(true);
    expect(optionBox("Transfer").checked).toBe(true);
    expect(optionBox("Mint").checked).toBe(true);
    expect(document.querySelector("[aria-label='Excluded functions']")).toBeNull();
  });

  it("excludes the labels that are unchecked and applies them only on OK", () => {
    render(ALL_FUNCTIONS);
    openModal();

    act(() => optionBox("Mint").click());
    act(() => optionBox("Swap").click());

    expect(allBox().indeterminate).toBe(true);
    expect(optionBox("Transfer").checked).toBe(true);
    expect(chips()).toEqual(["Mint", "Swap"]);
    expect(document.body.textContent).toContain("All except 2");
    expect(onChange).not.toHaveBeenCalled();

    act(() => button("OK").click());
    expect(onChange).toHaveBeenCalledWith(exclude("Mint", "Swap"));
    expect(document.querySelector("[role=dialog]")).toBeNull();
  });

  it("lists every transaction again when the last unchecked label is checked", () => {
    render(ALL_FUNCTIONS);
    openModal();

    act(() => optionBox("Mint").click());
    act(() => optionBox("Mint").click());
    act(() => button("OK").click());

    expect(onChange).toHaveBeenCalledWith(ALL_FUNCTIONS);
  });

  it("checks every label again when All is checked with some of them excluded", () => {
    render(exclude("Mint"));
    openModal();
    expect(allBox().indeterminate).toBe(true);

    act(() => allBox().click());

    expect(allBox().checked).toBe(true);
    expect(optionBox("Mint").checked).toBe(true);
  });

  it("starts from nothing checked when All is unchecked, and applies the picks that follow", () => {
    render(ALL_FUNCTIONS);
    openModal();

    act(() => allBox().click());

    expect(allBox().checked).toBe(false);
    expect(optionBox("Transfer").checked).toBe(false);

    act(() => optionBox("Swap").click());
    act(() => optionBox("Transfer").click());
    expect(document.body.textContent).toContain("2 selected");

    act(() => button("OK").click());
    expect(onChange).toHaveBeenCalledWith(include("Swap", "Transfer"));
  });

  it("applies nothing checked as it is, and OK stays available", () => {
    render(include("Mint"));
    openModal();

    act(() => optionBox("Mint").click());
    expect(button("OK").disabled).toBe(false);
    act(() => button("OK").click());

    expect(onChange).toHaveBeenCalledWith(include());
  });

  it("opens with nothing checked after Clear was applied", () => {
    render(include());
    openModal();

    expect(allBox().checked).toBe(false);
    expect(allBox().indeterminate).toBe(false);
    ["Transfer", "Mint", "Swap"].forEach(name => expect(optionBox(name).checked).toBe(false));
    expect(container.querySelector("[aria-label='Filter']")).not.toBeNull();
  });

  it.each([
    ["an include filter", include("Mint", "Swap")],
    ["an exclude filter", exclude("Mint", "Swap")],
  ])("unchecks everything on Clear for %s, and applies it", (_name, applied) => {
    render(applied);
    openModal();

    act(() => button("Clear").click());

    expect(allBox().checked).toBe(false);
    expect(allBox().indeterminate).toBe(false);
    ["Transfer", "Mint", "Swap"].forEach(name => expect(optionBox(name).checked).toBe(false));
    expect(document.querySelector("[role=group]")).toBeNull();

    act(() => button("OK").click());
    expect(onChange).toHaveBeenCalledWith(include());
  });

  it("starts from the applied filter", () => {
    render(include("Mint", "Swap"));
    openModal();

    expect(chips()).toEqual(["Mint", "Swap"]);
    expect(optionBox("Mint").checked).toBe(true);
    expect(optionBox("Transfer").checked).toBe(false);
  });

  it("discards the changes when the modal is closed", () => {
    render(ALL_FUNCTIONS);
    openModal();
    act(() => optionBox("Swap").click());

    act(() => q("button[aria-label=Close]").click());

    expect(onChange).not.toHaveBeenCalled();
    expect(document.querySelector("[role=dialog]")).toBeNull();
  });

  it("keeps the exclusions of an earlier search while another keyword lists other labels", () => {
    render(ALL_FUNCTIONS);
    openModal();
    act(() => optionBox("Mint").click());

    mockUseGetNames.mockReturnValue(names("Burn", "Mint"));
    const input = q<HTMLInputElement>("input[type=search]");
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, "bur");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    act(() => void jest.advanceTimersByTime(300));

    expect(mockUseGetNames).toHaveBeenLastCalledWith({ keyword: "bur" }, expect.anything());
    expect(optionBox("Burn").checked).toBe(true);
    expect(optionBox("Mint").checked).toBe(false);
    expect(chips()).toEqual(["Mint"]);
    // "All" is not a search result.
    expect(document.querySelectorAll("ul label")).toHaveLength(2);
  });

  it("stops checking at the label limit the API accepts", () => {
    const labels = Array.from({ length: MAX_FUNCTION_LABELS }, (_, index) => `Fn${index}`);
    render(include(...labels));
    openModal();

    expect(optionBox("Mint").disabled).toBe(true);
    expect(document.body.textContent).toContain(`Up to ${MAX_FUNCTION_LABELS} functions can be selected`);
  });

  it("stops unchecking at the label limit, and still lets an excluded label be checked again", () => {
    const labels = Array.from({ length: MAX_FUNCTION_LABELS }, (_, index) => `Fn${index}`);
    mockUseGetNames.mockReturnValue(names("Mint", "Fn1"));
    render(exclude(...labels));
    openModal();

    expect(optionBox("Mint").disabled).toBe(true);
    expect(optionBox("Fn1").disabled).toBe(false);
    expect(document.body.textContent).toContain(`Up to ${MAX_FUNCTION_LABELS} functions can be excluded`);
  });

  it("does not toggle All when the info icon next to it is clicked", () => {
    render(exclude("Mint"));
    openModal();
    expect(allBox().indeterminate).toBe(true);

    act(() => q("ul label > span:last-child").click());

    expect(allBox().indeterminate).toBe(true);
    expect(allBox().checked).toBe(false);
    expect(optionBox("Mint").checked).toBe(false);
  });

  it("keeps All until the search keyword is applied", () => {
    render(ALL_FUNCTIONS);
    openModal();

    const input = q<HTMLInputElement>("input[type=search]");
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, "mi");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(document.querySelectorAll("ul label")).toHaveLength(4);

    act(() => void jest.advanceTimersByTime(300));
    expect(document.querySelectorAll("ul label")).toHaveLength(3);
  });

  it("tells a failed label request apart from an empty search", () => {
    mockUseGetNames.mockReturnValue({ data: undefined, isLoading: false, isError: true });
    render(ALL_FUNCTIONS);
    openModal();

    expect(document.body.textContent).toContain("Failed to load functions");
    expect(document.body.textContent).not.toContain("No match found");
  });

  it("closes on Escape", () => {
    render(ALL_FUNCTIONS);
    openModal();

    act(() => void document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));

    expect(document.querySelector("[role=dialog]")).toBeNull();
  });
});
