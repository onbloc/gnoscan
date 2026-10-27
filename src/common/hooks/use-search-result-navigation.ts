import React, { RefObject, useCallback, useEffect, useState } from "react";

const OPTION_SELECTOR = "[data-search-option]";

const getOptions = (list: HTMLElement | null) => Array.from(list?.querySelectorAll<HTMLElement>(OPTION_SELECTOR) ?? []);

/** Wraps around at both ends. From no selection, Down goes to the first option and Up to the last. */
export const getNextOptionIndex = (index: number, step: 1 | -1, count: number) => {
  if (index === -1 && step === -1) return count - 1;
  return (index + step + count) % count;
};

/**
 * Keyboard navigation for a search dropdown rendered next to its input.
 * Arrow keys move the active option, Enter opens it and Escape closes the dropdown.
 * Options are the elements marked with `data-search-option`, and the active one gets `data-active`.
 * Mouse hover moves the same active option, so the pointer and the keyboard never highlight two items.
 */
export const useSearchResultNavigation = ({
  inputRef,
  listRef,
  open,
  close,
  resetKey,
}: {
  inputRef?: RefObject<HTMLInputElement>;
  listRef: RefObject<HTMLElement>;
  open: boolean;
  close: () => void;
  resetKey: unknown;
}) => {
  // Tied to the results it was picked from, so new results start with nothing selected.
  const [active, setActive] = useState({ key: resetKey, index: -1 });
  const activeIndex = open && active.key === resetKey ? active.index : -1;
  const setActiveIndex = useCallback(
    (update: number | ((index: number) => number)) =>
      setActive(previous => {
        const current = previous.key === resetKey ? previous.index : -1;
        const index = typeof update === "function" ? update(current) : update;
        return previous.key === resetKey && previous.index === index ? previous : { key: resetKey, index };
      }),
    [resetKey],
  );

  useEffect(() => {
    const options = getOptions(listRef.current);
    options.forEach((option, index) => option.toggleAttribute("data-active", index === activeIndex));
    options[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [listRef, activeIndex, resetKey, open]);

  useEffect(() => {
    const input = inputRef?.current;
    if (!input || !open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing) return;

      if (event.key === "Escape") {
        event.preventDefault();
        setActiveIndex(-1);
        close();
        return;
      }

      const options = getOptions(listRef.current);

      if (event.key === "Enter") {
        // The highlighted option, read from the DOM so a held arrow key never leaves it stale.
        const option = options.find(element => element.hasAttribute("data-active"));
        if (!option) return;
        // The input's own Enter handler skips the keyword search when this is set.
        event.preventDefault();
        (option.querySelector("a") ?? option).click();
        return;
      }

      if ((event.key !== "ArrowDown" && event.key !== "ArrowUp") || options.length === 0) return;
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex(index => getNextOptionIndex(index, step, options.length));
    };

    input.addEventListener("keydown", onKeyDown);
    return () => input.removeEventListener("keydown", onKeyDown);
  }, [inputRef, listRef, open, close, setActiveIndex]);

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const option = (event.target as HTMLElement).closest<HTMLElement>(OPTION_SELECTOR);
      if (option) setActiveIndex(getOptions(listRef.current).indexOf(option));
    },
    [listRef, setActiveIndex],
  );

  const onMouseLeave = useCallback(() => setActiveIndex(-1), [setActiveIndex]);

  return { onMouseMove, onMouseLeave };
};
