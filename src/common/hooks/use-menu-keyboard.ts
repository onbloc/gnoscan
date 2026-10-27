import React, { RefObject, useCallback } from "react";
import { flushSync } from "react-dom";

import { getNextOptionIndex } from "@/common/utils/list-navigation.utility";

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
 * Escape closes the menu and returns focus to the trigger, and the menu closes once focus moves outside it.
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
  const onKeyDown = useCallback(
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
      // Render the menu open first, so its items can take focus.
      if (!open) flushSync(() => setOpen(true));
      focusNextItem(menuRef.current, event.key === "ArrowDown" ? 1 : -1);
    },
    [open, setOpen, triggerRef, menuRef],
  );

  const onBlur = useCallback(
    (event: React.FocusEvent) => {
      // Moving between the trigger and the items keeps it open. A click on nothing focusable is left to outside click.
      const next = event.relatedTarget;
      if (open && next && !event.currentTarget.contains(next)) setOpen(false);
    },
    [open, setOpen],
  );

  return { onKeyDown, onBlur };
};
