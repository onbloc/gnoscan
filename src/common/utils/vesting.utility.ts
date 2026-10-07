// Parses an RFC3339 vesting time from the API
export const parseVestingTime = (value?: string | null): Date | null => {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatVestingDate = (date: Date, month: "short" | "long" = "short") =>
  new Intl.DateTimeFormat("en-US", { month, day: "numeric", year: "numeric", timeZone: "UTC" }).format(date);
