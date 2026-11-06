import BigNumber from "bignumber.js";

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

// The API bounds an explicit range to 365 days, so 1Y is the longest bounded range.
const RANGE_DAYS: Record<Exclude<BalanceRange, "All">, number> = {
  "1M": 30,
  "6M": 180,
  "1Y": 365,
};

const DAY_MS = 24 * 60 * 60 * 1000;

const toUtcDate = (time: number) => new Date(time).toISOString().slice(0, 10);

/** Builds the request of a range, counting UTC days back from `now` (the API buckets by UTC day). */
export const makeBalanceHistoryRequest = (
  address: string,
  range: BalanceRange,
  now: number,
): GetAccountNativeBalanceHistoryRequest => {
  if (range === BALANCE_RANGE.ALL) {
    return { address, range: "all" };
  }

  return { address, from: toUtcDate(now - (RANGE_DAYS[range] - 1) * DAY_MS), to: toUtcDate(now) };
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
