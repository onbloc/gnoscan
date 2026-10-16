/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

import { acquireBodyScrollLock, useBodyScrollLock } from "./use-body-scroll-lock";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

function Overlay({ locked }: { locked: boolean }) {
  useBodyScrollLock(locked);
  return null;
}

afterEach(() => {
  document.body.style.overflow = "";
});

it("keeps the page locked until the last overlay releases, whatever order they close in", () => {
  const releaseMenu = acquireBodyScrollLock();
  // The token panel opens under the still-open menu.
  const releasePanel = acquireBodyScrollLock();
  expect(document.body.style.overflow).toBe("hidden");

  releaseMenu();
  expect(document.body.style.overflow).toBe("hidden");

  releasePanel();
  expect(document.body.style.overflow).toBe("");
});

it("restores the overflow value that existed before the first overlay opened", () => {
  document.body.style.overflow = "scroll";
  const release = acquireBodyScrollLock();
  const releaseAgain = acquireBodyScrollLock();
  expect(document.body.style.overflow).toBe("hidden");

  release();
  releaseAgain();
  expect(document.body.style.overflow).toBe("scroll");
});

it("ignores a repeated release so it cannot unlock another overlay", () => {
  const releaseFirst = acquireBodyScrollLock();
  const releaseSecond = acquireBodyScrollLock();

  releaseFirst();
  releaseFirst();
  expect(document.body.style.overflow).toBe("hidden");

  releaseSecond();
  expect(document.body.style.overflow).toBe("");
});

it("releases the lock when a locked overlay closes or unmounts", () => {
  const root = createRoot(document.createElement("div"));
  act(() => root.render(<Overlay locked={true} />));
  expect(document.body.style.overflow).toBe("hidden");

  act(() => root.render(<Overlay locked={false} />));
  expect(document.body.style.overflow).toBe("");

  act(() => root.render(<Overlay locked={true} />));
  act(() => root.unmount());
  expect(document.body.style.overflow).toBe("");
});
