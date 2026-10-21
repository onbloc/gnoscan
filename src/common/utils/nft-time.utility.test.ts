import { formatNftRelativeTime } from "./nft-time.utility";

const now = Date.parse("2026-10-14T12:00:00Z");

it.each([
  [59, "<1m ago"],
  [60, "1m ago"],
  [3599, "59m ago"],
  [3600, "1h ago"],
  [7200, "2h ago"],
  [86399, "23h ago"],
  [86400, "1d ago"],
  [30 * 86400, "30d ago"],
])("formats an NFT activity age of %i seconds as %s", (seconds, expected) => {
  expect(formatNftRelativeTime(new Date(now - seconds * 1000).toISOString(), now)).toBe(expected);
});

it("treats RFC3339 timezone offsets as the same instant", () => {
  expect(formatNftRelativeTime("2026-10-14T19:00:00+09:00", now)).toBe("2h ago");
  expect(formatNftRelativeTime("2026-10-14T06:00:00-04:00", now)).toBe("2h ago");
});

it.each([null, undefined, "", "not-a-date"])("does not invent an activity age for %s", value => {
  expect(formatNftRelativeTime(value, now)).toBe("-");
});
