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

/**
 * The tab to open for `url`, or null when this URL was already handled (applied or
 * written by a click) or its hash matches no shown tab yet. Keyed by URL rather than
 * a flag so a section reused across pages (token A -> token B) still follows the hash.
 */
export function getHashTabToApply(url: string, lastHandledUrl: string | null, tabNames: string[]): string | null {
  if (url === lastHandledUrl) return null;
  const hashIndex = url.indexOf("#");
  return hashIndex === -1 ? null : findTabByHash(url.slice(hashIndex), tabNames);
}

/**
 * Mirrors the selected tab into the URL hash without adding a history entry and returns the new URL.
 * Keeps history.state so Next.js and useHistoryEntryState still see the same entry key, and updates
 * its `as` because Next.js restores the URL from it on Back/Forward.
 */
export function writeTabHash(tabName: string): string {
  const url = `${window.location.pathname}${window.location.search}#${toTabHash(tabName)}`;
  window.history.replaceState({ ...window.history.state, as: url }, "", url);
  return url;
}
