import { useCallback, useEffect, useState } from "react";

const STORAGE_PREFIX = "__detail_state_";

// Flips after the first client effect, so the hydration render keeps server defaults.
let hasHydrated = false;

// Next.js stamps every history entry with a unique `key`; a fresh visit gets a fresh key.
function getStorageKey(name: string): string | null {
  if (typeof window === "undefined") return null;
  const entryKey = window.history.state?.key;
  return entryKey ? `${STORAGE_PREFIX}${entryKey}_${name}` : null;
}

export function readHistoryEntryState<T>(name: string, fallback: T): T {
  const storageKey = getStorageKey(name);
  if (!storageKey) return fallback;
  try {
    const raw = window.sessionStorage.getItem(storageKey);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeHistoryEntryState<T>(name: string, value: T): void {
  const storageKey = getStorageKey(name);
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
  const readInitial = () => (hasHydrated ? readHistoryEntryState(name, initialValue) : initialValue);
  const [state, setState] = useState(() => ({ name, value: readInitial() }));

  // Same-route navigation (e.g. account A -> account B) reuses this component: re-read for the new scope.
  if (state.name !== name) {
    setState({ name, value: readInitial() });
  }

  useEffect(() => {
    hasHydrated = true;
  }, []);

  const setEntryValue = useCallback(
    (nextValue: T) => {
      setState({ name, value: nextValue });
      writeHistoryEntryState(name, nextValue);
    },
    [name],
  );

  return [state.name === name ? state.value : readInitial(), setEntryValue] as const;
}
