import { findTabByHash, toTabHash, writeTabHash } from "./tab-hash";

const TABS = ["Transactions", "Native Transfers", "Token Transfers", "Internal Transactions", "Events"];

describe("tab hash", () => {
  it("turns a tab name into a kebab case hash", () => {
    expect(toTabHash("Events")).toBe("events");
    expect(toTabHash("Internal Transactions")).toBe("internal-transactions");
  });

  it("finds the tab a hash points to", () => {
    expect(findTabByHash("#events", TABS)).toBe("Events");
    expect(findTabByHash("#native-transfers", TABS)).toBe("Native Transfers");
    expect(findTabByHash("#Token-Transfers", TABS)).toBe("Token Transfers");
  });

  it("ignores a hash that matches no visible tab", () => {
    expect(findTabByHash("#holders", TABS)).toBeNull();
    expect(findTabByHash("#", TABS)).toBeNull();
    expect(findTabByHash("", TABS)).toBeNull();
  });

  describe("writeTabHash", () => {
    afterEach(() => {
      delete (globalThis as { window?: unknown }).window;
    });

    it("replaces the url hash and keeps the history entry state", () => {
      const state = { key: "entry-a", __N: true };
      const replaceState = jest.fn();
      (globalThis as { window?: unknown }).window = { history: { state, replaceState } };

      writeTabHash("Native Transfers");

      expect(replaceState).toHaveBeenCalledWith(state, "", "#native-transfers");
    });
  });
});
