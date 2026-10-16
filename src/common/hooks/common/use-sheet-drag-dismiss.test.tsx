/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

import { useSheetDragDismiss } from "./use-sheet-drag-dismiss";

function mountSheet(onClose: () => void, enabled = true) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  function Sheet() {
    const ref = React.useRef<HTMLDivElement>(null);
    useSheetDragDismiss(ref, enabled, onClose);
    return <div ref={ref} data-testid="sheet" />;
  }
  act(() => root.render(<Sheet />));
  const sheet = container.firstElementChild as HTMLElement;
  return { sheet, unmount: () => act(() => root.unmount()) };
}

function touch(sheet: HTMLElement, type: string, clientY: number, timeStamp?: number, clientX = 100) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, "touches", { value: type === "touchend" ? [] : [{ clientX, clientY }] });
  if (timeStamp !== undefined) Object.defineProperty(event, "timeStamp", { value: timeStamp });
  act(() => {
    sheet.dispatchEvent(event);
  });
  return event;
}

beforeEach(() => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: true }) as unknown as typeof window.matchMedia;
});

it("follows a downward drag from the top of the content and closes past the threshold", () => {
  const onClose = jest.fn();
  const { sheet, unmount } = mountSheet(onClose);

  touch(sheet, "touchstart", 100, 0);
  const start = touch(sheet, "touchmove", 110, 100);
  const move = touch(sheet, "touchmove", 270, 500);
  expect(start.defaultPrevented).toBe(true);
  expect(move.defaultPrevented).toBe(true);
  expect(sheet.style.transform).toBe("translateY(160px)");
  touch(sheet, "touchend", 270, 500);

  expect(onClose).toHaveBeenCalledTimes(1);
  unmount();
  expect(sheet.style.transform).toBe("");
});

it("snaps back a short, slow drag without closing", () => {
  const onClose = jest.fn();
  const { sheet } = mountSheet(onClose);

  touch(sheet, "touchstart", 100, 0);
  touch(sheet, "touchmove", 140, 1000);
  touch(sheet, "touchend", 140, 1000);

  expect(onClose).not.toHaveBeenCalled();
  expect(sheet.style.transform).toBe("");
});

it("leaves the gesture to scrolling when the content is scrolled or the drag goes up", () => {
  const onClose = jest.fn();
  const { sheet } = mountSheet(onClose);

  sheet.scrollTop = 40;
  touch(sheet, "touchstart", 100, 0);
  const scrolledDown = touch(sheet, "touchmove", 300, 100);
  touch(sheet, "touchend", 300, 100);

  sheet.scrollTop = 0;
  touch(sheet, "touchstart", 300, 0);
  const up = touch(sheet, "touchmove", 200, 100);
  touch(sheet, "touchend", 200, 100);

  expect(scrolledDown.defaultPrevented).toBe(false);
  expect(up.defaultPrevented).toBe(false);
  expect(sheet.style.transform).toBe("");
  expect(onClose).not.toHaveBeenCalled();
});

it("does nothing when the panel is not laid out as a sheet", () => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: false }) as unknown as typeof window.matchMedia;
  const onClose = jest.fn();
  const { sheet } = mountSheet(onClose);

  touch(sheet, "touchstart", 100, 0);
  const move = touch(sheet, "touchmove", 400, 500);
  touch(sheet, "touchend", 400, 500);

  expect(move.defaultPrevented).toBe(false);
  expect(onClose).not.toHaveBeenCalled();
});

it("leaves a gesture that began as scrolling to scrolling, even after the content reaches the top", () => {
  const onClose = jest.fn();
  const { sheet } = mountSheet(onClose);

  sheet.scrollTop = 200;
  touch(sheet, "touchstart", 100, 0);
  touch(sheet, "touchmove", 160, 100);

  sheet.scrollTop = 0;
  const reachedTop = touch(sheet, "touchmove", 310, 200);
  touch(sheet, "touchend", 310, 200);

  expect(reachedTop.defaultPrevented).toBe(false);
  expect(sheet.style.transform).toBe("");
  expect(onClose).not.toHaveBeenCalled();
});

it("does not start a dismiss from a mostly horizontal swipe", () => {
  const { sheet } = mountSheet(jest.fn());

  touch(sheet, "touchstart", 100, 0, 100);
  const swipe = touch(sheet, "touchmove", 120, 100, 220);
  const later = touch(sheet, "touchmove", 400, 200, 220);

  expect(swipe.defaultPrevented).toBe(false);
  expect(later.defaultPrevented).toBe(false);
  expect(sheet.style.transform).toBe("");
});

it("snaps back a cancelled touch instead of closing", () => {
  const onClose = jest.fn();
  const { sheet } = mountSheet(onClose);

  touch(sheet, "touchstart", 100, 0);
  touch(sheet, "touchmove", 110, 100);
  touch(sheet, "touchmove", 400, 200);
  touch(sheet, "touchcancel", 400, 200);

  expect(onClose).not.toHaveBeenCalled();
  expect(sheet.style.transform).toBe("");
});

it("snaps back when the caller keeps the sheet open after a dismiss drag", () => {
  jest.useFakeTimers();
  try {
    const onClose = jest.fn();
    const { sheet } = mountSheet(onClose);

    touch(sheet, "touchstart", 100, 0);
    touch(sheet, "touchmove", 110, 100);
    touch(sheet, "touchmove", 400, 200);
    touch(sheet, "touchend", 400, 200);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(sheet.style.transform).toBe("translateY(290px)");

    act(() => {
      jest.advanceTimersByTime(600);
    });
    expect(sheet.style.transform).toBe("");
  } finally {
    jest.useRealTimers();
  }
});
