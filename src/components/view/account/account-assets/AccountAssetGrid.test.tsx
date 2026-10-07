/**
 * @jest-environment jsdom
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

import { DEVICE_TYPE } from "@/common/values/ui.constant";
import AccountAssetGrid from "./AccountAssetGrid";

const ITEMS = ["native", "a0", "a1", "a2", "a3"];

const renderGrid = (breakpoint: DEVICE_TYPE) => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement("div");
  const root = createRoot(container);

  act(() =>
    root.render(
      <AccountAssetGrid breakpoint={breakpoint}>
        {ITEMS.map(item => (
          <button key={item} type="button">
            {item}
          </button>
        ))}
      </AccountAssetGrid>,
    ),
  );

  const buttons = Array.from(container.querySelectorAll("button"));
  act(() => root.unmount());
  return buttons;
};

describe("AccountAssetGrid", () => {
  it("keeps row-major DOM order on desktop", () => {
    const buttons = renderGrid(DEVICE_TYPE.DESKTOP);

    expect(buttons.map(button => button.textContent)).toEqual(ITEMS);
    // Grid rows: [native, a0], [a1, a2], [a3]
    expect(buttons.map(button => (button.parentElement as HTMLElement).style.gridColumn)).toEqual([
      "1",
      "2",
      "1",
      "2",
      "1",
    ]);
  });

  it("renders items directly in a single column below desktop", () => {
    const buttons = renderGrid(DEVICE_TYPE.MOBILE);

    expect(buttons.map(button => button.textContent)).toEqual(ITEMS);
    expect(buttons.every(button => button.parentElement === buttons[0].parentElement)).toBe(true);
  });
});
