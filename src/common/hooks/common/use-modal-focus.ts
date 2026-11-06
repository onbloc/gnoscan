import { RefObject, useEffect } from "react";

/**
 * Focus handling of a portaled modal dialog: focus moves to `initialFocusRef`, Tab stays in the dialog (the app
 * root is inert), Escape calls `onClose`, and focus goes back to the element it came from when the dialog unmounts.
 */
export const useModalFocus = (onClose: () => void, initialFocusRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    // The dialog is portaled outside the app root, so an inert root keeps Tab inside it.
    const appRoot = document.getElementById("__next");
    appRoot?.setAttribute("inert", "");
    initialFocusRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      appRoot?.removeAttribute("inert");
      opener?.focus();
    };
  }, [onClose, initialFocusRef]);
};
