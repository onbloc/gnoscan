export interface GetAccountNativeBalanceChangesRequest {
  address: string;

  // Whole history from the first activity. Cannot be combined with from/to.
  range?: "all";

  // Inclusive UTC dates (YYYY-MM-DD); a bounded range is at most 365 days.
  from?: string;

  to?: string;

  page?: number;

  limit?: number;
}
