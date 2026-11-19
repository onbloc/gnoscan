/**
 * @jest-environment jsdom
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { RecoilRoot } from "recoil";
import { zindex } from "@/common/values/z-index";
import Tooltip from "./tooltip";

jest.mock("@/states", () => {
  const { atom } = jest.requireActual("recoil");
  return { themeState: atom({ key: "themeState", default: "light" }) };
});

it("renders the click tooltip above modals so Copied! is visible inside a bottom sheet", () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  jest.useFakeTimers();
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() =>
    root.render(
      <RecoilRoot>
        <Tooltip content="Copied!" trigger="click" copyText="g1abc">
          <button type="button">Copy</button>
        </Tooltip>
      </RecoilRoot>,
    ),
  );
  act(() => {
    container.querySelector("button")!.click();
    jest.advanceTimersByTime(100);
  });

  const popup = document.querySelector<HTMLElement>(".ant-tooltip");
  const popupZIndex = Number(popup?.style.zIndex);
  act(() => root.unmount());
  container.remove();
  jest.useRealTimers();

  expect(popupZIndex).toBeGreaterThan(zindex.modal);
});
