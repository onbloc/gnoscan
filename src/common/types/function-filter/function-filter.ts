/**
 * Function label filter of a transaction list. `exclude` lists every transaction but those with one of the labels;
 * `include` lists only the transactions with one of them. With no labels either lists every transaction: a cleared
 * filter (nothing checked) is `include` with no labels.
 */
export interface FunctionFilterValue {
  mode: "include" | "exclude";
  labels: string[];
}

/** Request parameters of a function filter, each left out while it has no label. */
export interface FunctionFilterApiParams {
  /** Exact function labels to keep: a transaction with any of them matches. */
  function?: string[];

  /** Exact function labels to drop: transactions with any of them are left out, those without a label stay. */
  excludeFunction?: string[];
}
