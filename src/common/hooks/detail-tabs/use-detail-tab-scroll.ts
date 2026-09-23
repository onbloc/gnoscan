import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

// Module-level so the position survives a tab's content unmounting/remounting,
// but resets on a full page reload.
const scrollPositions = new Map<string, number>();

const buildKey = (scopeKey: string, tabName: string) => `${scopeKey}::${tabName}`;

/**
 * Drop-in replacement for `useState(initialTab)` that remembers the page scroll
 * position per tab, scoped by `scopeKey` (e.g. realm path / address / token id),
 * and restores it when the same tab is selected again.
 */
export function useDetailTabScroll<T extends string>(scopeKey: string, initialTab: T) {
  const [currentTab, setCurrentTabState] = useState<T>(initialTab);
  const currentKeyRef = useRef(buildKey(scopeKey, currentTab));
  // Deepest scrollY reached while this tab is active. Tracked continuously
  // (not just captured at switch time) because the tab bar isn't sticky, so
  // switching tabs requires scrolling back up to it first — capturing only
  // at click time would record that shallow position instead of where the
  // user actually was reading.
  const maxScrollRef = useRef(0);

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      if (window.scrollY > maxScrollRef.current) {
        maxScrollRef.current = window.scrollY;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    currentKeyRef.current = buildKey(scopeKey, currentTab);
  }, [scopeKey, currentTab]);

  const setCurrentTab = useCallback((nextTab: T) => {
    scrollPositions.set(currentKeyRef.current, maxScrollRef.current);
    setCurrentTabState(nextTab);
  }, []);

  useLayoutEffect(() => {
    const saved = scrollPositions.get(buildKey(scopeKey, currentTab));
    maxScrollRef.current = saved ?? 0;
    if (saved !== undefined) {
      window.scrollTo(0, saved);
    }
  }, [scopeKey, currentTab]);

  return [currentTab, setCurrentTab] as const;
}
