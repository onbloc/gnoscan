import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

import { readHistoryEntryState, writeHistoryEntryState } from "./use-history-entry-state";

// useLayoutEffect warns during SSR; it only matters on the client.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const scrollStateName = (scope: string, tab: string) => `${scope}:scroll:${tab}`;

interface ScrollEnv {
  getScrollY: () => number;
  scrollTo: (y: number) => void;
  read: (name: string) => number | null;
  write: (name: string, y: number) => void;
}

/**
 * Remembers the deepest scroll position reached on the active tab. The tab bar isn't sticky,
 * so users scroll back up before switching: the click-time position says nothing about where they read.
 */
export function createTabScrollMemory(env: ScrollEnv) {
  let entryY = env.getScrollY();
  let deepestY = entryY;

  return {
    track() {
      deepestY = Math.max(deepestY, env.getScrollY());
    },
    // Save only when the user scrolled past the entry point, so an unread tab never moves on return.
    leave(name: string) {
      if (deepestY > entryY) env.write(name, deepestY);
    },
    // A revisit jumps down to the saved position; a first visit keeps the page where it is.
    // Never jump up: tabs are clicked at the tab bar, so a shallower save is just the scroll to reach it.
    enter(name: string) {
      const saved = env.read(name);
      if (saved !== null && saved > env.getScrollY()) env.scrollTo(saved);
      entryY = env.getScrollY();
      deepestY = entryY;
    },
  };
}

/**
 * Wraps a tab setter so each tab restores its scroll position when revisited within the same history entry.
 * Only user tab switches scroll; the initial mount is left to Next.js scroll restoration.
 */
export function useTabScrollMemory(scope: string, currentTab: string, setCurrentTab: (tab: string) => void) {
  const memoryRef = useRef<ReturnType<typeof createTabScrollMemory> | null>(null);
  const pendingTabRef = useRef<string | null>(null);

  useEffect(() => {
    const memory = createTabScrollMemory({
      getScrollY: () => window.scrollY,
      scrollTo: y => window.scrollTo(0, y),
      read: name => readHistoryEntryState<number | null>(name, null),
      write: writeHistoryEntryState,
    });
    memoryRef.current = memory;

    const handleScroll = () => memory.track();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scope]);

  const switchTab = useCallback(
    (nextTab: string) => {
      if (nextTab !== currentTab) {
        memoryRef.current?.leave(scrollStateName(scope, currentTab));
        pendingTabRef.current = nextTab;
      }
      setCurrentTab(nextTab);
    },
    [scope, currentTab, setCurrentTab],
  );

  // Runs after the new tab's rows are committed but before paint, so the jump shows no intermediate frame.
  useIsomorphicLayoutEffect(() => {
    if (pendingTabRef.current !== currentTab) return;
    pendingTabRef.current = null;
    memoryRef.current?.enter(scrollStateName(scope, currentTab));
  }, [scope, currentTab]);

  return switchTab;
}
