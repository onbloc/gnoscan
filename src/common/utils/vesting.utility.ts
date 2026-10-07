// Fallback genesis vesting end (UTC) when the API omits it
export const GENESIS_VESTING_END = new Date(Date.UTC(2028, 0, 1));

const MAX_TIMESTAMP_MS = 8.64e15;

// Accepts ISO strings or unix seconds (number or numeric string)
export const parseVestingTime = (value?: string | number | null): Date | null => {
  if (value == null || value === "") return null;

  const unixSeconds = typeof value === "number" ? value : /^\d+$/.test(value) ? Number(value) : null;
  if (unixSeconds != null && !(Number.isFinite(unixSeconds) && Math.abs(unixSeconds * 1000) <= MAX_TIMESTAMP_MS)) {
    return null;
  }

  const date = unixSeconds == null ? new Date(value) : new Date(unixSeconds * 1000);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatVestingDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(date);
