import { makeQueryParameter, makeRepeatedQueryParameter } from "@/common/utils/string-util";
import { FunctionFilterApiParams, FunctionFilterValue } from "@/common/types/function-filter";
import { ALL_FUNCTIONS, MAX_FUNCTION_LABELS } from "@/common/values/function-filter.constant";

/** Whether the label is checked: every label but the listed ones in exclude mode, only the listed ones in include. */
export const isFunctionChecked = (filter: FunctionFilterValue, label: string) =>
  filter.mode === "exclude" ? !filter.labels.includes(label) : filter.labels.includes(label);

/** Checks or unchecks one label. `labels` holds the unchecked labels in exclude mode and the checked ones in include. */
export const setFunctionChecked = (
  filter: FunctionFilterValue,
  label: string,
  checked: boolean,
): FunctionFilterValue => {
  const listed = filter.mode === "exclude" ? !checked : checked;
  const rest = filter.labels.filter(item => item !== label);

  return { mode: filter.mode, labels: listed ? [...rest, label] : rest };
};

/** The All row: checking lists every transaction, unchecking starts an include list with nothing checked. */
export const setAllFunctionsChecked = (checked: boolean): FunctionFilterValue =>
  checked ? ALL_FUNCTIONS : { mode: "include", labels: [] };

/** An include filter with no labels matches nothing, so it cannot be applied. */
export const isFunctionFilterApplicable = (filter: FunctionFilterValue) =>
  filter.mode === "exclude" || filter.labels.length > 0;

/** Once the list is full, a label can only be taken out of it. */
export const canToggleFunction = (filter: FunctionFilterValue, label: string) =>
  filter.labels.length < MAX_FUNCTION_LABELS || filter.labels.includes(label);

/** Drops a label from the list of the filter; an include filter left with no label lists every transaction. */
export const removeFunctionLabel = (filter: FunctionFilterValue, label: string): FunctionFilterValue => {
  const next = { mode: filter.mode, labels: filter.labels.filter(item => item !== label) };

  return isFunctionFilterApplicable(next) ? next : ALL_FUNCTIONS;
};

/** Request parameters of the filter: the labels to keep or to drop, none while every transaction is listed. Sorted, so the order of the picks does not change the query key. */
export const toFunctionFilterApiParams = ({ mode, labels }: FunctionFilterValue): FunctionFilterApiParams => {
  if (labels.length === 0) return {};

  const sorted = [...labels].sort();

  return mode === "include" ? { function: sorted } : { excludeFunction: sorted };
};

/** Identifies what the filter lists, for a list that starts again from page 1 when it changes. The label order is not part of it. */
export const getFunctionFilterScope = ({ mode, labels }: FunctionFilterValue) =>
  JSON.stringify([mode, [...labels].sort()]);

/**
 * Query string (`?…`, empty without parameters) of a list request: the plain parameters, then `function` and
 * `excludeFunction` once per label, URL-encoded. `makeQueryParameter` alone cannot send a list of values.
 */
export const makeFunctionFilterQueryParameter = <T extends FunctionFilterApiParams>({
  function: included,
  excludeFunction: excluded,
  ...rest
}: T) => {
  const query = [
    makeQueryParameter(rest as Parameters<typeof makeQueryParameter>[0]).slice(1),
    ...makeRepeatedQueryParameter("function", included),
    ...makeRepeatedQueryParameter("excludeFunction", excluded),
  ]
    .filter(Boolean)
    .join("&");

  return query ? `?${query}` : "";
};
