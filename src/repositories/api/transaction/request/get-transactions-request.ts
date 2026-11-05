/** Function filter of the transaction list: one of the two, never both. */
export type TransactionFunctionFilter = { function: string } | { functionKeyword: string };

export interface GetTransactionsRequestParameters {
  page?: number;

  /** Pins the list to a block height, from `page.snapshotHeight` of an earlier response (default: latest). */
  snapshotHeight?: number;

  limit?: number; // @default 20

  /** Exact function label (max 256 chars); not with `functionKeyword`. */
  function?: string;

  /** Case-insensitive text matched against function labels (max 256 chars); not with `function`. */
  functionKeyword?: string;
}
