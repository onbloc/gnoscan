/** URL hash for a detail tab, e.g. "Native Transfers" -> "native-transfers". */
export function toTabHash(tabName: string): string {
  return tabName.trim().toLowerCase().replace(/\s+/g, "-");
}

/** The tab a URL hash points to, or null when it matches none of the given tabs. */
export function findTabByHash(hash: string, tabNames: string[]): string | null {
  const target = hash.replace(/^#/, "").toLowerCase();
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
 * Writes the tab into the URL hash without a new history entry and returns the URL.
 * Keeps the Next.js entry key and updates `as`, which Next.js restores on Back/Forward.
 */
export function writeTabHash(tabName: string): string {
  const url = `${window.location.pathname}${window.location.search}#${toTabHash(tabName)}`;
  window.history.replaceState({ ...window.history.state, as: url }, "", url);
  return url;
}
