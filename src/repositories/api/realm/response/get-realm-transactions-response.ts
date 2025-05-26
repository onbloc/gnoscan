import { TransactionTableModel } from "@/models/api/common";

export interface GetRealmTransactionsResponse {
  items: TransactionTableModel[];

  page: {
    cursor: string;
    hasNext: boolean;
    nextCursor: string;
  };
}
