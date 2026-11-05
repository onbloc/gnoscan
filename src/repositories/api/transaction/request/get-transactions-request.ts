/** Most distinct function labels the API accepts in one request, for `function` and for `excludeFunction` each. */
export const MAX_FUNCTION_LABELS = 100;

export interface GetTransactionsRequestParameters {
  page?: number;

  /** Pins the list to a block height, from `page.snapshotHeight` of an earlier response (default: latest). */
  snapshotHeight?: number;

  limit?: number; // @default 20

  /** Exact function labels to keep, from the function name suggestions; a transaction with any of them matches. */
  function?: string[];

  /** Exact function labels to drop: transactions with any of them are left out, those without a label stay. */
  excludeFunction?: string[];
}

/**
 * Function filter of the transaction list. `exclude` lists every transaction but those with one of the labels
 * (no labels: every transaction); `include` lists only the transactions with one of them.
 */
export interface TransactionFunctionFilterValue {
  mode: "include" | "exclude";
  labels: string[];
}

/** The filter that lists every transaction. */
export const ALL_FUNCTIONS: TransactionFunctionFilterValue = { mode: "exclude", labels: [] };
