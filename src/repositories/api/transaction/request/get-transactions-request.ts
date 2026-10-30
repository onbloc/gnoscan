import { TransactionFilter } from "./transaction-filter";

export interface GetTransactionsRequestParameters extends TransactionFilter {
  cursor?: string;

  limit?: number; // @default 20
}
