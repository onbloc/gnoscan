import BigNumber from "bignumber.js";

import { ActivityAmount, ActivityListResponse, ActivityRow } from "@/models/api/activity/activity-model";
import { TRANSACTION_CSV_HEADER, toCsvAmountValue, toTransactionCsvRow } from "./csv-rows.utility";
import { CsvCell } from "./csv.utility";
import { toDisplayAmount } from "./activity.utility";
import { ResolvedTokenMeta, TokenMetaFallback } from "./token.utility";
import { Amount } from "@/types/data-type";

export interface AccountCsvAmountFormatters {
  getTokenMeta: (denom: string, fallback: TokenMetaFallback) => ResolvedTokenMeta;
  getFeeAmount: (fee: Amount) => Amount;
}

export const ACCOUNT_CSV_LIMIT = 3000;
const PAGE_SIZE = 100;

export class AccountCsvLimitError extends Error {
  constructor() {
    super(`CSV exports are limited to ${ACCOUNT_CSV_LIMIT} transactions. Select a shorter date range.`);
    this.name = "AccountCsvLimitError";
  }
}

const DIRECT_HEADER = [
  ...TRANSACTION_CSV_HEADER.slice(0, 6),
  "Caller",
  "Native Value",
  "Native Value Denom",
  "Fee",
  "Fee Denom",
];

const TRANSFER_HEADER = [...TRANSACTION_CSV_HEADER.slice(0, 6), "Amount (In)", "Amount (Out)", "Fee", "Fee Denom"];

const toAmountJson = (amounts: ActivityAmount[], { getTokenMeta }: AccountCsvAmountFormatters): string =>
  JSON.stringify(
    amounts
      .filter(amount => !new BigNumber(amount.value).isZero())
      .map(amount => {
        const meta = getTokenMeta(amount.denom, {
          name: amount.symbol,
          symbol: amount.symbol,
          decimals: amount.decimals,
        });
        const display = toDisplayAmount(amount, meta);
        return {
          value: toCsvAmountValue(display.value),
          rawValue: amount.value,
          decimals: meta.decimals,
          symbol: display.denom,
          denom: amount.denom,
          ...(amount.tokenIds ? { tokenIds: amount.tokenIds } : {}),
        };
      }),
  );

const toActivityCsvRow = (
  activity: ActivityRow,
  variant: "direct" | "transfers",
  formatters: AccountCsvAmountFormatters,
): CsvCell[] => {
  const native = activity.nativeValue;
  const nativeDisplay = toDisplayAmount(
    native,
    formatters.getTokenMeta(native.denom, {
      name: native.symbol,
      symbol: native.symbol,
      decimals: native.decimals,
    }),
  );
  const transaction = toTransactionCsvRow(
    {
      ...activity,
      fromAddress: activity.callerAddress,
      fromName: "",
      toAddress: "",
      toName: "",
      amount: native,
    },
    nativeDisplay,
  );
  const fee = formatters.getFeeAmount(activity.fee);
  const feeCells = [toCsvAmountValue(fee.value), fee.denom];

  return variant === "direct"
    ? [
        ...transaction.slice(0, 6),
        activity.callerAddress,
        ...(new BigNumber(native.value).isZero()
          ? ["-", ""]
          : [toCsvAmountValue(nativeDisplay.value), nativeDisplay.denom]),
        ...feeCells,
      ]
    : [
        ...transaction.slice(0, 6),
        toAmountJson(activity.amountsIn, formatters),
        toAmountJson(activity.amountsOut, formatters),
        ...feeCells,
      ];
};

export const fetchAccountActivityCsv = async (
  fetchPage: (pagination: { page: number; limit: number }) => Promise<ActivityListResponse>,
  variant: "direct" | "transfers",
  formatters: AccountCsvAmountFormatters,
): Promise<{ header: string[]; rows: CsvCell[][] }> => {
  const rows: CsvCell[][] = [];
  const identities = new Set<string>();
  let expectedTotal: number | undefined;

  for (let page = 1; ; page += 1) {
    const response = await fetchPage({ page, limit: PAGE_SIZE });
    const totalCount = response.page?.totalCount;

    if (
      !Number.isSafeInteger(totalCount) ||
      totalCount < 0 ||
      typeof response.page?.hasNext !== "boolean" ||
      !Array.isArray(response.items)
    ) {
      throw new Error("Inconsistent account activity pagination. Please try the export again.");
    }
    if (totalCount > ACCOUNT_CSV_LIMIT) throw new AccountCsvLimitError();
    if (expectedTotal !== undefined && totalCount !== expectedTotal) {
      throw new Error("Inconsistent account activity pagination. Please try the export again.");
    }
    expectedTotal = totalCount;

    const expectedSize = Math.min(PAGE_SIZE, totalCount - rows.length);
    const hasNext = rows.length + response.items.length < totalCount;
    if (response.items.length !== expectedSize || response.page.hasNext !== hasNext) {
      throw new Error("Incomplete account activity pagination. Please try the export again.");
    }

    for (const activity of response.items) {
      const identity = JSON.stringify([activity.txHash, activity.blockHeight]);
      if (identities.has(identity)) {
        throw new Error("Repeated account activity transaction. Please try the export again.");
      }
      identities.add(identity);
      rows.push(toActivityCsvRow(activity, variant, formatters));
    }

    if (!hasNext) return { header: variant === "direct" ? DIRECT_HEADER : TRANSFER_HEADER, rows };
  }
};
