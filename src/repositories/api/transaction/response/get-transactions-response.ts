import { TransactionModel } from "@/models/api/transaction/transaction-model";

export interface GetTransactionsResponse {
  items: TransactionModel[];

  page: {
    hasNext: boolean;
    totalCount: number;
    /** Block height the list is pinned to; absent when the chain has no blocks. */
    snapshotHeight?: number;
  };
}
