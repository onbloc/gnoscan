import { isOnlyStorageEventsHidden, toActivityIdentifier } from "./activity.utility";

describe("toActivityIdentifier", () => {
  it("formats the Events tab identifier with a lowercase hash", () => {
    expect(toActivityIdentifier("37D627B4ABBFFD7", 3)).toBe("37d627b4abbffd7_3");
  });
});

const base = {
  isFetched: true,
  totalEventCount: 10,
  visibleEventCount: 0,
  eventType: "",
  includeStorage: false,
};

describe("isOnlyStorageEventsHidden", () => {
  it("is true when the unfiltered list is empty but storage events exist", () => {
    expect(isOnlyStorageEventsHidden(base)).toBe(true);
  });

  it.each([
    ["the list is still loading", { isFetched: false }],
    ["storage events are already shown", { includeStorage: true }],
    ["an event type filter is applied", { eventType: "Transfer" }],
    ["non-storage events are visible", { visibleEventCount: 3 }],
    ["the realm has no events at all", { totalEventCount: 0 }],
    ["the total count is unknown", { totalEventCount: undefined }],
  ])("is false when %s", (_, override) => {
    expect(isOnlyStorageEventsHidden({ ...base, ...override })).toBe(false);
  });
});
