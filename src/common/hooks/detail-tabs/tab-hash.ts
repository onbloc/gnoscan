import { getSteadyContentMinHeight } from "./use-steady-tab-switch";

/** URL hash for a detail tab, e.g. "Native Transfers" -> "native-transfers". */
export function toTabHash(tabName: string): string {
  return tabName.trim().toLowerCase().replace(/\s+/g, "-");
}

/**
 * The tab a URL hash points to, or null when it matches none of the given tabs.
 * Only the segment before the first "&" names the tab; the rest carries tab parameters
 * (e.g. "#inventory&tokenId=1011").
 */
export function findTabByHash(hash: string, tabNames: string[]): string | null {
  const target = hash.replace(/^#/, "").split("&")[0].toLowerCase();
  if (!target) return null;
  return tabNames.find(tabName => toTabHash(tabName) === target) ?? null;
}

/** The tab to open for `url`, or null when the URL was already handled or its hash matches no shown tab. */
export function getHashTabToApply(url: string, lastHandledUrl: string | null, tabNames: string[]): string | null {
  if (url === lastHandledUrl) return null;
  const hashIndex = url.indexOf("#");
  return hashIndex === -1 ? null : findTabByHash(url.slice(hashIndex), tabNames);
}

/**
 * Replaces the URL hash without a new history entry and returns the URL.
 * Keeps the Next.js entry key and updates `as`, which Next.js restores on Back/Forward.
 */
export function replaceUrlHash(hash: string): string {
  const url = `${window.location.pathname}${window.location.search}${hash}`;
  window.history.replaceState({ ...window.history.state, as: url }, "", url);
  return url;
}

/** Writes the tab into the URL hash without a new history entry and returns the URL. */
export function writeTabHash(tabName: string): string {
  return replaceUrlHash(`#${toTabHash(tabName)}`);
}

const USER_INPUT_EVENTS = ["wheel", "touchstart", "keydown", "mousedown"] as const;

/**
 * Keeps `element` at the top of the viewport while the page above it is still loading and
 * pushing it down. When the page is too short to scroll that far, `content` gets the min-height
 * it needs. Stops on the first user input or after `durationMs`; returns a cancel function.
 */
export function holdElementInView(element: HTMLElement, content: HTMLElement | null, durationMs = 15000): () => void {
  const align = () => {
    const top = element.getBoundingClientRect().top;
    if (Math.abs(top) <= 1) return;
    const minHeight =
      content &&
      getSteadyContentMinHeight(
        window.scrollY + top,
        window.innerHeight,
        document.documentElement.scrollHeight,
        content.offsetHeight,
      );
    if (minHeight != null && content) content.style.minHeight = `${minHeight}px`;
    element.scrollIntoView({ block: "start" });
  };
  const observer = new ResizeObserver(align);
  observer.observe(document.body);
  observer.observe(document.documentElement);
  align();
  const timer = window.setTimeout(cancel, durationMs);
  USER_INPUT_EVENTS.forEach(type => window.addEventListener(type, cancel, { passive: true }));

  function cancel() {
    observer.disconnect();
    window.clearTimeout(timer);
    USER_INPUT_EVENTS.forEach(type => window.removeEventListener(type, cancel));
  }
  return cancel;
}
