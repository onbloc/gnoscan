import React, { RefObject, useCallback, useEffect, useRef, useState } from "react";

import { getNextOptionIndex } from "@/common/utils/list-navigation.utility";

const OPTION_SELECTOR = "[data-search-option]";

const getOptions = (list: HTMLElement | null) => Array.from(list?.querySelectorAll<HTMLElement>(OPTION_SELECTOR) ?? []);

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
  inputRef: RefObject<HTMLInputElement>;
  listRef: RefObject<HTMLElement>;
  open: boolean;
  close: () => void;
  resetKey: unknown;
}) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  // New results or opening and closing start with nothing selected, also when reopening on the same cached results.
  const [selectionScope, setSelectionScope] = useState({ resetKey, open });
  if (selectionScope.resetKey !== resetKey || selectionScope.open !== open) {
    setSelectionScope({ resetKey, open });
    setActiveIndex(-1);
  }
  // Only arrow keys scroll the active option into view, so hovering never moves the list under the pointer.
  const scrollToActive = useRef(false);

  useEffect(() => {
    const options = getOptions(listRef.current);
    options.forEach((option, index) => option.toggleAttribute("data-active", index === activeIndex));
    if (scrollToActive.current) options[activeIndex]?.scrollIntoView({ block: "nearest" });
    scrollToActive.current = false;
  }, [listRef, activeIndex, resetKey, open]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input || !open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing) return;

      if (event.key === "Escape") {
        event.preventDefault();
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
      scrollToActive.current = true;
      setActiveIndex(index => getNextOptionIndex(index, step, options.length));
    };

    input.addEventListener("keydown", onKeyDown);
    return () => input.removeEventListener("keydown", onKeyDown);
  }, [inputRef, listRef, open, close]);

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const option = (event.target as HTMLElement).closest<HTMLElement>(OPTION_SELECTOR);
      if (option && !option.hasAttribute("data-active")) setActiveIndex(getOptions(listRef.current).indexOf(option));
    },
    [listRef],
  );

  const onMouseLeave = useCallback(() => setActiveIndex(-1), []);

  return { onMouseMove, onMouseLeave };
};
