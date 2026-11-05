import {
  ALL_FUNCTIONS,
  MAX_FUNCTION_LABELS,
  TransactionFunctionFilterValue,
} from "@/repositories/api/transaction/request";

/** Whether the label is checked: every label but the listed ones in exclude mode, only the listed ones in include. */
export const isFunctionChecked = (filter: TransactionFunctionFilterValue, label: string) =>
  filter.mode === "exclude" ? !filter.labels.includes(label) : filter.labels.includes(label);

/** Checks or unchecks one label. `labels` holds the unchecked labels in exclude mode and the checked ones in include. */
export const setFunctionChecked = (
  filter: TransactionFunctionFilterValue,
  label: string,
  checked: boolean,
): TransactionFunctionFilterValue => {
  const listed = filter.mode === "exclude" ? !checked : checked;
  const rest = filter.labels.filter(item => item !== label);

  return { mode: filter.mode, labels: listed ? [...rest, label] : rest };
};

/** The All row: checking lists every transaction, unchecking starts an include list with nothing checked. */
export const setAllFunctionsChecked = (checked: boolean): TransactionFunctionFilterValue =>
  checked ? ALL_FUNCTIONS : { mode: "include", labels: [] };

/** An include filter with no labels matches nothing, so it cannot be applied. */
export const isFunctionFilterApplicable = (filter: TransactionFunctionFilterValue) =>
  filter.mode === "exclude" || filter.labels.length > 0;

/** Once the list is full, a label can only be taken out of it. */
export const canToggleFunction = (filter: TransactionFunctionFilterValue, label: string) =>
  filter.labels.length < MAX_FUNCTION_LABELS || filter.labels.includes(label);

/** Drops a label from the list of the filter; an include filter left with no label lists every transaction. */
export const removeFunctionLabel = (
  filter: TransactionFunctionFilterValue,
  label: string,
): TransactionFunctionFilterValue => {
  const next = { mode: filter.mode, labels: filter.labels.filter(item => item !== label) };

  return isFunctionFilterApplicable(next) ? next : ALL_FUNCTIONS;
};
