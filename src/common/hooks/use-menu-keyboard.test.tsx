/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

import { useMenuKeyboard } from "./use-menu-keyboard";

function mountMenu() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  function Menu() {
    const [open, setOpen] = React.useState(false);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const menuRef = React.useRef<HTMLUListElement>(null);
    const { onKeyDown, onBlur } = useMenuKeyboard({ open, setOpen, triggerRef, menuRef });
    return (
      <div data-testid="wrapper" data-open={open} onKeyDown={onKeyDown} onBlur={onBlur}>
        <button ref={triggerRef}>Menu</button>
        {open && (
          <ul ref={menuRef}>
            <li>
              <a href="#one" data-menu-item>
                One
              </a>
            </li>
            <li>
              <a href="#two" data-menu-item>
                Two
              </a>
            </li>
          </ul>
        )}
      </div>
    );
  }
  act(() => root.render(<Menu />));
  const wrapper = container.querySelector<HTMLElement>("[data-testid=wrapper]")!;
  const trigger = wrapper.querySelector("button")!;
  const outside = document.createElement("button");
  document.body.appendChild(outside);
  const isOpen = () => wrapper.dataset.open === "true";
  const items = () => Array.from(wrapper.querySelectorAll<HTMLElement>("[data-menu-item]"));
  const unmount = () => {
    act(() => root.unmount());
    container.remove();
    outside.remove();
  };
  return { wrapper, trigger, outside, isOpen, items, unmount };
}

function press(target: HTMLElement, key: string) {
  const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
  act(() => {
    target.dispatchEvent(event);
  });
  return event;
}

let menu: ReturnType<typeof mountMenu>;

beforeEach(() => {
  menu = mountMenu();
});

afterEach(() => {
  menu.unmount();
  jest.restoreAllMocks();
});

it("opens a closed menu on ArrowDown and focuses the first item", () => {
  menu.trigger.focus();
  const event = press(menu.trigger, "ArrowDown");

  expect(event.defaultPrevented).toBe(true);
  expect(menu.isOpen()).toBe(true);
  expect(document.activeElement).toBe(menu.items()[0]);
});

it("closes on Escape and returns focus to the trigger", () => {
  menu.trigger.focus();
  press(menu.trigger, "ArrowDown");
  press(menu.items()[0], "Escape");

  expect(menu.isOpen()).toBe(false);
  expect(document.activeElement).toBe(menu.trigger);
});

it("stays open while focus moves inside and closes when it moves out", () => {
  menu.trigger.focus();
  press(menu.trigger, "ArrowDown");
  act(() => menu.items()[1].focus());
  expect(menu.isOpen()).toBe(true);

  act(() => menu.outside.focus());
  expect(menu.isOpen()).toBe(false);
});

it("closes when focus leaves the page", () => {
  menu.trigger.focus();
  press(menu.trigger, "ArrowDown");
  act(() => menu.items()[0].blur());

  expect(menu.isOpen()).toBe(false);
});

it("stays open when a click under the pointer moves focus to nothing", () => {
  menu.trigger.focus();
  press(menu.trigger, "ArrowDown");
  jest.spyOn(menu.wrapper, "matches").mockImplementation(selector => selector === ":hover");
  act(() => menu.items()[0].blur());

  expect(menu.isOpen()).toBe(true);
});
