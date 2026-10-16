import { useEffect, useLayoutEffect } from "react";

// useLayoutEffect warns during SSR; it only matters on the client.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

// Overlays (mobile menu, token bottom sheet) can overlap, so the lock is owned by a set of holders.
// The original inline overflow is captured by the first holder and restored by the last one,
// which keeps one overlay from restoring a lock value that belongs to another.
const holders = new Set<symbol>();
let originalOverflow = "";

/** Locks page scrolling until the returned release is called; locks nest across holders. */
export function acquireBodyScrollLock(): () => void {
  const holder = Symbol("body-scroll-lock");
  if (holders.size === 0) {
    originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  holders.add(holder);

  return () => {
    if (!holders.delete(holder) || holders.size > 0) return;
    document.body.style.overflow = originalOverflow;
  };
}

/** Holds the page scroll lock while `locked` is true. */
export function useBodyScrollLock(locked: boolean) {
  useIsomorphicLayoutEffect(() => {
    if (!locked) return;
    return acquireBodyScrollLock();
  }, [locked]);
}
