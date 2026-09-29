import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

import { useHistoryEntryState } from "./use-history-entry-state";

// useLayoutEffect warns during SSR; it only matters on the client.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const paddingStateName = (tab: string) => `detail-tabs:padding:${tab}`;

/**
 * Min height the tab content needs so the document stays tall enough to keep `anchorY`,
 * or null when it already is. Pure so it can be tested without a DOM.
 */
export function getSteadyContentMinHeight(
  anchorY: number,
  viewportHeight: number,
  documentHeight: number,
  contentHeight: number,
): number | null {
  const deficit = anchorY + viewportHeight - documentHeight;
  return deficit > 0 ? contentHeight + deficit : null;
}

/**
 * Keeps the page still when switching tabs. A shorter (or empty) tab would shrink the
 * document and make the browser clamp the scroll up, so the content area is padded
 * with just enough min-height to hold the previous position. Runs before paint.
 * The padding is kept per history entry and rendered as a style, so on Back/Forward it is
 * already in the DOM when Next.js restores the scroll (from a layout effect that runs first).
 */
export function useSteadyTabSwitch<T extends HTMLElement>(currentTab: string, setCurrentTab: (tab: string) => void) {
  const contentRef = useRef<T>(null);
  const anchorYRef = useRef<number | null>(null);
  const [padding, setPadding] = useHistoryEntryState<number | null>(paddingStateName(currentTab), null);

  const selectTab = useCallback(
    (tab: string) => {
      if (tab !== currentTab) anchorYRef.current = window.scrollY;
      setCurrentTab(tab);
    },
    [currentTab, setCurrentTab],
  );

  useIsomorphicLayoutEffect(() => {
    const anchorY = anchorYRef.current;
    const content = contentRef.current;
    anchorYRef.current = null;
    if (anchorY === null || !content) return;

    // Measure the new tab without the padding left from the previous switch.
    content.style.minHeight = "";
    let nextPadding: number | null = null;
    // Layout slack around the content (e.g. a min-height page shell) can absorb part of the
    // padding, so re-measure until the document is tall enough; each pass consumes slack.
    for (let pass = 0; pass < 4; pass++) {
      const minHeight = getSteadyContentMinHeight(
        anchorY,
        window.innerHeight,
        document.documentElement.scrollHeight,
        content.offsetHeight,
      );
      if (minHeight === null) break;
      nextPadding = minHeight;
      content.style.minHeight = `${minHeight}px`;
    }
    setPadding(nextPadding);
    if (window.scrollY !== anchorY) window.scrollTo(0, anchorY);
  }, [currentTab]);

  const contentStyle = padding === null ? undefined : { minHeight: padding };

  return { contentRef, contentStyle, selectTab };
}
