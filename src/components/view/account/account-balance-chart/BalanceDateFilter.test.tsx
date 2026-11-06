/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "styled-components";

import theme from "@/styles/theme";
import { BalanceDateFilter } from "./BalanceDateFilter";

jest.mock("@/states", () => {
  const { atom } = jest.requireActual("recoil");
  return { themeState: atom({ key: "themeState", default: "light" }) };
});
jest.mock("@/common/hooks/common/use-token-meta", () => ({ GNOTToken: { symbol: "GNOT", decimals: 6 } }));
jest.mock("@/assets/svgs/icon-close.svg", () => () => null);
jest.mock("@/assets/svgs/icon-filter.svg", () => () => null);

let container: HTMLDivElement;
let modalRoot: HTMLDivElement;
let root: ReturnType<typeof createRoot>;
const onChange = jest.fn();

const q = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
const okButton = () =>
  Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find(b => b.textContent?.trim() === "OK")!;
const dateInputs = () => Array.from(document.querySelectorAll<HTMLInputElement>("input[type=date]"));

// React tracks the value itself, so a change has to go through the native setter.
const setDate = (input: HTMLInputElement, value: string) =>
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });

const render = (range: { from: string; to: string } | null) =>
  act(() =>
    root.render(
      <RecoilRoot>
        <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
          <BalanceDateFilter range={range} onChange={onChange} />
        </ThemeProvider>
      </RecoilRoot>,
    ),
  );

// The portal finds its target in an effect, so the modal appears after a second pass.
const openModal = () => {
  act(() => q("button[aria-haspopup=dialog]").click());
  act(() => void 0);
};

beforeAll(() => Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }));

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(Date.UTC(2026, 10, 6, 12));
  onChange.mockReset();
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

describe("BalanceDateFilter", () => {
  it("names the applied range on the button", () => {
    render({ from: "2026-10-01", to: "2026-10-31" });
    expect(q("button[aria-haspopup=dialog]").getAttribute("aria-label")).toBe(
      "Date filter, Oct 1, 2026 - Oct 31, 2026",
    );

    render(null);
    expect(q("button[aria-haspopup=dialog]").getAttribute("aria-label")).toBe("Date filter");
  });

  it("opens on the last 30 days and applies them on OK", () => {
    render(null);
    openModal();

    expect(dateInputs().map(input => input.value)).toEqual(["2026-10-08", "2026-11-06"]);

    act(() => okButton().click());
    expect(onChange).toHaveBeenCalledWith({ from: "2026-10-08", to: "2026-11-06" });
    expect(document.querySelector("[role=dialog]")).toBeNull();
  });

  it("opens on the applied range", () => {
    render({ from: "2026-10-01", to: "2026-10-31" });
    openModal();

    expect(dateInputs().map(input => input.value)).toEqual(["2026-10-01", "2026-10-31"]);
  });

  it("refuses a range over 365 days with the reason", () => {
    render(null);
    openModal();
    setDate(dateInputs()[0], "2025-11-06");

    expect(q("[role=alert]").textContent).toMatch(/365 days/);
    expect(okButton().disabled).toBe(true);
    act(() => okButton().click());
    expect(onChange).not.toHaveBeenCalled();
  });

  it("leaves OK disabled, without an error, while a date is cleared", () => {
    render(null);
    openModal();
    setDate(dateInputs()[1], "");

    expect(document.querySelector("[role=alert]")).toBeNull();
    expect(okButton().disabled).toBe(true);
  });
});
