// Dates are YYYY-MM-DD in UTC and both bounds are inclusive.
export interface TransactionDateFilter {
  fromDate?: string;
  toDate?: string;
}

export interface TransactionFilter extends TransactionDateFilter {
  status?: "success" | "failed";
  messageType?: string;
  // Exact function name of a MsgCall.
  function?: string;
}
