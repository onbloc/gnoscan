/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

import { useSearchResultNavigation } from "./use-search-result-navigation";

type Props = { open: boolean; resetKey: string; close: () => void; onSearch: () => void; onOpenOption: () => void };

function mountSearch(initial: Omit<Props, "close" | "onSearch" | "onOpenOption">) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const close = jest.fn();
  const onSearch = jest.fn();
  const onOpenOption = jest.fn();
  function Search({ open, resetKey, close, onSearch, onOpenOption }: Props) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const listRef = React.useRef<HTMLUListElement>(null);
    useSearchResultNavigation({ inputRef, listRef, open, close, resetKey });
    return (
      <>
        <input
          ref={inputRef}
          onKeyDown={event => event.key === "Enter" && !event.nativeEvent.defaultPrevented && onSearch()}
        />
        <ul ref={listRef}>
          {["one", "two"].map(name => (
            <li key={name} data-search-option>
              <a href={`#${name}`} onClick={event => (event.preventDefault(), onOpenOption())}>
                {name}
              </a>
            </li>
          ))}
        </ul>
      </>
    );
  }
  const render = (props: Omit<Props, "close" | "onSearch" | "onOpenOption">) =>
    act(() => root.render(<Search {...props} close={close} onSearch={onSearch} onOpenOption={onOpenOption} />));
  render(initial);
  const input = container.querySelector("input")!;
  const activeIndex = () =>
    Array.from(container.querySelectorAll("[data-search-option]")).findIndex(option =>
      option.hasAttribute("data-active"),
    );
  const unmount = () => {
    act(() => root.unmount());
    container.remove();
  };
  return { input, render, activeIndex, close, onSearch, onOpenOption, unmount };
}

function press(target: HTMLElement, key: string, isComposing = false) {
  const event = new KeyboardEvent("keydown", { key, isComposing, bubbles: true, cancelable: true });
  act(() => {
    target.dispatchEvent(event);
  });
  return event;
}

let search: ReturnType<typeof mountSearch>;

beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

beforeEach(() => {
  search = mountSearch({ open: true, resetKey: "a" });
});

afterEach(() => search.unmount());

it("moves the active option with the arrow keys", () => {
  press(search.input, "ArrowDown");
  expect(search.activeIndex()).toBe(0);
  press(search.input, "ArrowDown");
  expect(search.activeIndex()).toBe(1);
  press(search.input, "ArrowUp");
  expect(search.activeIndex()).toBe(0);
});

it("opens the active option on Enter instead of running the keyword search", () => {
  press(search.input, "ArrowDown");
  const event = press(search.input, "Enter");

  expect(event.defaultPrevented).toBe(true);
  expect(search.onOpenOption).toHaveBeenCalledTimes(1);
  expect(search.onSearch).not.toHaveBeenCalled();
});

it("runs the keyword search on Enter when no option is active", () => {
  press(search.input, "Enter");

  expect(search.onOpenOption).not.toHaveBeenCalled();
  expect(search.onSearch).toHaveBeenCalledTimes(1);
});

it("ignores Enter while an IME composition is in progress", () => {
  press(search.input, "ArrowDown");
  const event = press(search.input, "Enter", true);

  expect(event.defaultPrevented).toBe(false);
  expect(search.onOpenOption).not.toHaveBeenCalled();
});

it("closes on Escape", () => {
  press(search.input, "Escape");
  expect(search.close).toHaveBeenCalledTimes(1);
});

it("resets the selection on new results and when closing or reopening", () => {
  press(search.input, "ArrowDown");
  search.render({ open: true, resetKey: "b" });
  expect(search.activeIndex()).toBe(-1);

  press(search.input, "ArrowDown");
  search.render({ open: false, resetKey: "b" });
  expect(search.activeIndex()).toBe(-1);

  search.render({ open: true, resetKey: "b" });
  expect(search.activeIndex()).toBe(-1);
});
