import React, { RefObject, useCallback, useEffect, useRef } from "react";

import { getNextOptionIndex } from "./use-search-result-navigation";

const MENU_ITEM_SELECTOR = "[data-menu-item]";

const focusNextItem = (menu: HTMLElement | null, step: 1 | -1) => {
  const items = Array.from(menu?.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR) ?? []);
  if (items.length === 0) return;
  const index = items.indexOf(document.activeElement as HTMLElement);
  items[getNextOptionIndex(index, step, items.length)].focus();
};

/**
 * Keyboard handling for a dropdown menu, attached to the element that wraps its trigger and list.
 * Up and Down open the menu and move focus through the `data-menu-item` elements, wrapping around at both ends.
 * Escape closes the menu and returns focus to the trigger.
 */
export const useMenuKeyboard = ({
  open,
  setOpen,
  triggerRef,
  menuRef,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: RefObject<HTMLElement>;
  menuRef: RefObject<HTMLElement>;
}) => {
  // Focus waits for the menu to render open when an arrow key opened it.
  const pendingStep = useRef<1 | -1 | null>(null);

  useEffect(() => {
    if (!open || !pendingStep.current) return;
    focusNextItem(menuRef.current, pendingStep.current);
    pendingStep.current = null;
  }, [open, menuRef]);

  return useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        if (!open) return;
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      // Arrow keys keep moving the caret inside text fields such as the custom RPC inputs.
      if (event.target instanceof HTMLInputElement) return;
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;

      if (!open) {
        pendingStep.current = step;
        setOpen(true);
        return;
      }
      focusNextItem(menuRef.current, step);
    },
    [open, setOpen, triggerRef, menuRef],
  );
};
