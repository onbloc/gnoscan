import { useCallback, useEffect, useState } from "react";

const STORAGE_PREFIX = "__detail_state_";

// Flips after the first client effect, so the hydration render keeps server defaults.
let hasHydrated = false;

// Next.js stamps every history entry with a unique `key`; a fresh visit gets a fresh key.
function getCurrentEntryKey(): string | null {
  if (typeof window === "undefined") return null;
  return window.history.state?.key ?? null;
}

function getStorageKey(name: string, entryKey: string | null): string | null {
  return entryKey ? `${STORAGE_PREFIX}${entryKey}_${name}` : null;
}

export function readHistoryEntryState<T>(name: string, fallback: T, entryKey = getCurrentEntryKey()): T {
  const storageKey = getStorageKey(name, entryKey);
  if (!storageKey) return fallback;
  try {
    const raw = window.sessionStorage.getItem(storageKey);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeHistoryEntryState<T>(name: string, value: T, entryKey = getCurrentEntryKey()): void {
  const storageKey = getStorageKey(name, entryKey);
  if (!storageKey) return;
  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // Storage unavailable (private mode, quota): state simply isn't restored.
  }
}

/**
 * `useState` scoped to the current browser history entry: back/forward navigation
 * restores the value (e.g. the selected tab or event filters), a new visit starts fresh.
 */
export function useHistoryEntryState<T>(name: string, initialValue: T) {
  const readInitial = (entryKey: string | null) =>
    hasHydrated ? readHistoryEntryState(name, initialValue, entryKey) : initialValue;
  const [state, setState] = useState(() => {
    const entryKey = getCurrentEntryKey();
    return { name, entryKey, value: readInitial(entryKey) };
  });

  // A reused component (e.g. account A -> account B, or a new entry on the same route) re-reads for the new scope.
  const liveEntryKey = hasHydrated ? getCurrentEntryKey() : state.entryKey;
  const isCurrentScope = state.name === name && state.entryKey === liveEntryKey;
  if (!isCurrentScope) {
    setState({ name, entryKey: liveEntryKey, value: readInitial(liveEntryKey) });
  }

  useEffect(() => {
    hasHydrated = true;
  }, []);

  // Bound to the entry this state was read for, so a delayed (debounced) write
  // that fires after navigating away still lands on its originating entry.
  const { entryKey } = state;
  const setEntryValue = useCallback(
    (nextValue: T) => {
      setState({ name, entryKey, value: nextValue });
      writeHistoryEntryState(name, nextValue, entryKey);
    },
    [name, entryKey],
  );

  return [isCurrentScope ? state.value : readInitial(liveEntryKey), setEntryValue] as const;
}
