import BigNumber from "bignumber.js";

import { DAY_TIME } from "@/common/values/constant-value";
import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { GetAccountNativeBalanceHistoryRequest } from "@/repositories/api/account/request";
import { AccountNativeBalancePoint } from "@/repositories/api/account/response";

export const BALANCE_RANGE = {
  ONE_MONTH: "1M",
  SIX_MONTHS: "6M",
  ONE_YEAR: "1Y",
  ALL: "All",
} as const;

export type BalanceRange = (typeof BALANCE_RANGE)[keyof typeof BALANCE_RANGE];

export const BALANCE_RANGES: BalanceRange[] = Object.values(BALANCE_RANGE);

// The API bounds an explicit range to 365 days, so 1Y is the longest preset.
export const MAX_RANGE_DAYS = 365;

const RANGE_DAYS: Record<Exclude<BalanceRange, "All">, number> = {
  "1M": 30,
  "6M": 180,
  "1Y": MAX_RANGE_DAYS,
};

const toUtcDate = (time: number) => new Date(time).toISOString().slice(0, 10);

/** Inclusive UTC dates (YYYY-MM-DD) picked by the user. */
export interface BalanceCustomRange {
  from: string;
  to: string;
}

export type BalanceRangeSelection = BalanceRange | BalanceCustomRange;

export const isCustomRange = (selection: BalanceRangeSelection): selection is BalanceCustomRange =>
  typeof selection === "object";

/** The UTC day of `now`, which is the latest day the API reports. */
export const getBalanceToday = (now: number) => toUtcDate(now);

/** A range of the last `days` UTC days up to the day of `now`, inclusive. */
export const makeRecentRange = (now: number, days: number): BalanceCustomRange => ({
  from: toUtcDate(now - (days - 1) * DAY_TIME),
  to: toUtcDate(now),
});

/** Why a picked range cannot be requested, or null when it can. Dates compare as strings (YYYY-MM-DD). */
export const validateCustomRange = ({ from, to }: BalanceCustomRange, today: string): string | null => {
  if (!from || !to) return "Select both dates.";
  if (from > to) return "The start date must not be after the end date.";
  if (to > today) return "The end date must not be in the future.";

  const days = (Date.parse(to) - Date.parse(from)) / DAY_TIME + 1;
  if (days > MAX_RANGE_DAYS) return `The range must not exceed ${MAX_RANGE_DAYS} days.`;

  return null;
};

/** Builds the request of a selection, counting UTC days back from `now` (the API buckets by UTC day). */
export const makeBalanceHistoryRequest = (
  address: string,
  selection: BalanceRangeSelection,
  now: number,
): GetAccountNativeBalanceHistoryRequest => {
  if (isCustomRange(selection)) {
    return { address, from: selection.from, to: selection.to };
  }

  if (selection === BALANCE_RANGE.ALL) {
    return { address, range: "all" };
  }

  return { address, ...makeRecentRange(now, RANGE_DAYS[selection]) };
};

export interface BalanceChartPoint {
  date: string;
  // Balance in GNOT
  value: number;
}

/** Converts closing balances from ugnot to GNOT. */
export const toBalanceChartPoints = (items: AccountNativeBalancePoint[]): BalanceChartPoint[] =>
  items.map(item => ({
    date: item.date,
    value: BigNumber(item.balance).shiftedBy(-GNOTToken.decimals).toNumber(),
  }));

export interface BalanceExtreme {
  date: string;
  // Balance in GNOT, as an exact decimal string
  value: string;
}

/** Finds the highest and lowest closing balance (the earliest day on a tie). Null without points. */
export const findBalanceExtremes = (
  items: AccountNativeBalancePoint[],
): { highest: BalanceExtreme; lowest: BalanceExtreme } | null => {
  if (items.length === 0) {
    return null;
  }

  let highest = items[0];
  let lowest = items[0];

  for (const item of items) {
    const balance = BigNumber(item.balance);
    if (balance.isGreaterThan(highest.balance)) highest = item;
    if (balance.isLessThan(lowest.balance)) lowest = item;
  }

  const toExtreme = (item: AccountNativeBalancePoint): BalanceExtreme => ({
    date: item.date,
    value: BigNumber(item.balance).shiftedBy(-GNOTToken.decimals).toFixed(),
  });

  return { highest: toExtreme(highest), lowest: toExtreme(lowest) };
};
