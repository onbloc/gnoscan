/**
 * @jest-environment jsdom
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { RecoilRoot } from "recoil";
import Tooltip from "./tooltip";

jest.mock("@/states", () => {
  const { atom } = jest.requireActual("recoil");
  return { themeState: atom({ key: "themeState", default: "light" }) };
});

const focusTrigger = (openOnFocus: boolean) => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  jest.useFakeTimers();
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() =>
    root.render(
      <RecoilRoot>
        <Tooltip content="Vesting info" openOnFocus={openOnFocus}>
          <button type="button">lock</button>
        </Tooltip>
      </RecoilRoot>,
    ),
  );
  act(() => {
    container.querySelector("button")!.focus();
    jest.runAllTimers();
  });

  const isOpen = document.body.textContent?.includes("Vesting info") ?? false;
  act(() => root.unmount());
  container.remove();
  jest.useRealTimers();
  return isOpen;
};

it("opens on keyboard focus when openOnFocus is set", () => {
  expect(focusTrigger(true)).toBe(true);
});

it("stays closed on focus by default", () => {
  expect(focusTrigger(false)).toBe(false);
});
