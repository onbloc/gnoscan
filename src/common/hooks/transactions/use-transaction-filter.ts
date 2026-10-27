import React from "react";

import { useHistoryEntryState } from "@/common/hooks/detail-tabs/use-history-entry-state";
import { useDebounce } from "@/common/hooks/use-debounce";
import { TransactionFilter } from "@/repositories/api/transaction/request";

export interface TransactionFilterInput {
  fromDate: string;
  toDate: string;
  status: "" | "success" | "failed";
  messageType: string;
  function: string;
}

export const EMPTY_TRANSACTION_FILTER: TransactionFilterInput = {
  fromDate: "",
  toDate: "",
  status: "",
  messageType: "",
  function: "",
};

/**
 * Maps the filter inputs to API parameters: empty fields are omitted so an unfiltered list
 * keeps its original request, and a reversed date range is swapped instead of failing.
 */
export const toTransactionFilterParams = (input: TransactionFilterInput): TransactionFilter => {
  const [fromDate, toDate] =
    input.fromDate && input.toDate && input.fromDate > input.toDate
      ? [input.toDate, input.fromDate]
      : [input.fromDate, input.toDate];

  const params: TransactionFilter = {};
  if (fromDate) params.fromDate = fromDate;
  if (toDate) params.toDate = toDate;
  if (input.status) params.status = input.status;
  if (input.messageType) params.messageType = input.messageType;
  const functionName = input.function.trim();
  if (functionName) params.function = functionName;
  return params;
};

/**
 * Filter state for a transaction list, restored on back navigation. The free-text function
 * input is debounced so typing does not refetch on every keystroke.
 */
export const useTransactionFilter = (stateKey: string) => {
  const [input, setInput] = useHistoryEntryState<TransactionFilterInput>(stateKey, EMPTY_TRANSACTION_FILTER);
  const debouncedFunction = useDebounce(input.function, 300);

  const params = React.useMemo(
    () => toTransactionFilterParams({ ...input, function: debouncedFunction }),
    [input, debouncedFunction],
  );

  return { input, setInput, params, isFiltered: Object.keys(params).length > 0 };
};
