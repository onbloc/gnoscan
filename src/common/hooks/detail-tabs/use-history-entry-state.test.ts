import { readHistoryEntryState, writeHistoryEntryState } from "./use-history-entry-state";

const createStorage = () => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
  };
};

const setHistoryKey = (key: string | undefined) => {
  (globalThis as { window?: unknown }).window = {
    history: { state: key ? { key } : null },
    sessionStorage: (globalThis as { __storage?: unknown }).__storage,
  };
};

describe("history entry state", () => {
  beforeEach(() => {
    (globalThis as { __storage?: unknown }).__storage = createStorage();
  });

  afterAll(() => {
    delete (globalThis as { window?: unknown }).window;
  });

  it("restores a value written for the same history entry", () => {
    setHistoryKey("entry-a");
    writeHistoryEntryState("realm:tab", "Native Transfers");
    expect(readHistoryEntryState("realm:tab", "Transactions")).toBe("Native Transfers");
  });

  it("starts from the fallback on a different history entry", () => {
    setHistoryKey("entry-a");
    writeHistoryEntryState("realm:tab", "Events");
    setHistoryKey("entry-b");
    expect(readHistoryEntryState("realm:tab", "Transactions")).toBe("Transactions");
  });

  it("falls back when the history entry has no key", () => {
    setHistoryKey(undefined);
    writeHistoryEntryState("realm:includeStorage", true);
    expect(readHistoryEntryState("realm:includeStorage", false)).toBe(false);
  });
});
