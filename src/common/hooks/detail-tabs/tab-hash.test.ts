import { ACTIVITY_TAB } from "@/common/values/activity-tab.constant";
import { findTabByHash, getHashTabToApply, toTabHash, writeTabHash } from "./tab-hash";

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

  it("gives every detail tab a unique hash that resolves back to it", () => {
    const tabNames = [...Object.values(ACTIVITY_TAB), "Messages"];
    const hashes = tabNames.map(toTabHash);

    expect(new Set(hashes).size).toBe(tabNames.length);
    tabNames.forEach(tabName => expect(findTabByHash(`#${toTabHash(tabName)}`, tabNames)).toBe(tabName));
  });

  describe("getHashTabToApply", () => {
    it("applies the hash tab for a URL not handled yet", () => {
      expect(getHashTabToApply("/tokens/a#events", null, TABS)).toBe("Events");
    });

    it("skips a URL already handled, so a clicked tab is not overridden", () => {
      expect(getHashTabToApply("/tokens/a#events", "/tokens/a#events", TABS)).toBeNull();
    });

    it("applies again when the same section moves to another URL", () => {
      expect(getHashTabToApply("/tokens/b#holders", "/tokens/a#events", [...TABS, "Holders"])).toBe("Holders");
    });

    it("waits while the hash tab is not shown yet", () => {
      expect(getHashTabToApply("/transactions/details?txhash=a#events", null, ["Messages"])).toBeNull();
      expect(getHashTabToApply("/tokens/a", null, TABS)).toBeNull();
    });
  });

  describe("writeTabHash", () => {
    afterEach(() => {
      delete (globalThis as { window?: unknown }).window;
    });

    it("replaces the url hash and points the history entry at the new url", () => {
      const replaceState = jest.fn();
      (globalThis as { window?: unknown }).window = {
        location: { pathname: "/tokens/a", search: "?chainId=test" },
        history: { state: { key: "entry-a", __N: true, as: "/tokens/a?chainId=test#holders" }, replaceState },
      };

      const url = writeTabHash("Native Transfers");

      expect(url).toBe("/tokens/a?chainId=test#native-transfers");
      expect(replaceState).toHaveBeenCalledWith({ key: "entry-a", __N: true, as: url }, "", url);
    });
  });
});
