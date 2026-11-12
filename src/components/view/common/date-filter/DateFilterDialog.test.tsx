/** @jest-environment jsdom */
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "styled-components";

import theme from "@/styles/theme";
import { DateFilterDialog } from "./DateFilterDialog";
import { DateFilterRange, validateDateFilterRange } from "./date-filter.utility";

jest.mock("@/states", () => {
  const { atom } = jest.requireActual("recoil");
  return { themeState: atom({ key: "dateDialogThemeState", default: "light" }) };
});
jest.mock("@/assets/svgs/icon-close.svg", () => () => null);

let container: HTMLDivElement;
let root: Root;
const onApply = jest.fn();
const onClose = jest.fn();
const today = "2026-11-06";
const okButton = () =>
  Array.from(container.querySelectorAll<HTMLButtonElement>("button")).find(button => button.textContent === "OK")!;

const render = (range: DateFilterRange, maxRangeDays?: number) =>
  act(() => {
    root.render(
      <RecoilRoot>
        <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
          <DateFilterDialog
            now={Date.UTC(2026, 10, 6, 12)}
            range={range}
            maxRangeDays={maxRangeDays}
            onApply={onApply}
            onClose={onClose}
          />
        </ThemeProvider>
      </RecoilRoot>,
    );
  });

beforeAll(() => Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }));
beforeEach(() => {
  onApply.mockReset();
  onClose.mockReset();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe("DateFilterDialog", () => {
  it.each([
    { from: today, to: today },
    { from: "1970-01-01", to: today },
  ])("applies an uncapped valid range %j", range => {
    render(range);
    expect(okButton().disabled).toBe(false);
    act(() => okButton().click());
    expect(onApply).toHaveBeenCalledWith(range);
  });

  it("enforces an inclusive graph cap when supplied", () => {
    render({ from: "2025-11-06", to: today }, 365);
    expect(okButton().disabled).toBe(true);
    expect(container.querySelector("[role=alert]")?.textContent).toMatch(/365 days/);
    act(() => okButton().click());
    expect(onApply).not.toHaveBeenCalled();
  });

  it.each([
    { from: "1969-12-31", to: today },
    { from: "2026-02-30", to: today },
    { from: "2026-2-01", to: today },
    { from: "invalid", to: today },
    { from: today, to: "2026-11-05" },
    { from: today, to: "2026-11-07" },
    { from: "", to: today },
    { from: today, to: "" },
  ])("rejects invalid dates %j", range => {
    render(range);
    expect(okButton().disabled).toBe(true);
    act(() => okButton().click());
    expect(onApply).not.toHaveBeenCalled();
    expect(validateDateFilterRange(range, today)).not.toBeNull();
  });

  it("closes on Escape without applying the draft", () => {
    render({ from: today, to: today });
    act(() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onApply).not.toHaveBeenCalled();
  });

  it("cancels with the close button without applying the draft", () => {
    render({ from: today, to: today });
    act(() => container.querySelector<HTMLButtonElement>("button[aria-label=Close]")!.click());
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onApply).not.toHaveBeenCalled();
  });
});

describe("validateDateFilterRange", () => {
  it("counts both UTC endpoints and accepts leap days only in leap years", () => {
    expect(validateDateFilterRange({ from: "2023-03-02", to: "2024-02-29" }, today, 365)).toBeNull();
    expect(validateDateFilterRange({ from: "2023-03-01", to: "2024-02-29" }, today, 365)).toMatch(/365 days/);
    expect(validateDateFilterRange({ from: "2025-02-29", to: today }, today)).not.toBeNull();
  });
});
