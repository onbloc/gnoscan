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
 * Mirrors the selected tab into the URL hash without adding a history entry.
 * Keeps history.state so Next.js and useHistoryEntryState still see the same entry key.
 */
export function writeTabHash(tabName: string): void {
  window.history.replaceState(window.history.state, "", `#${toTabHash(tabName)}`);
}
