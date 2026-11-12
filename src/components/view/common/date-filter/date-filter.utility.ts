export interface DateFilterRange {
  from: string;
  to: string;
}

const DAY_TIME = 24 * 60 * 60 * 1000;

const isUtcDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < "1970-01-01") return false;
  const time = Date.parse(`${value}T00:00:00.000Z`);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value;
};

export const validateDateFilterRange = (
  { from, to }: DateFilterRange,
  today: string,
  maxRangeDays?: number,
): string | null => {
  if (!from || !to) return "Select both dates.";
  if (!isUtcDate(from) || !isUtcDate(to)) return "Select valid dates on or after January 1, 1970.";
  if (from > to) return "The start date must not be after the end date.";
  if (to > today) return "The end date must not be in the future.";
  if (maxRangeDays !== undefined && (Date.parse(to) - Date.parse(from)) / DAY_TIME + 1 > maxRangeDays) {
    return `Select a range of up to ${maxRangeDays} days.`;
  }
  return null;
};
