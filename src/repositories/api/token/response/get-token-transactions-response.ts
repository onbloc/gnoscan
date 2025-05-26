import { TransactionTableModel } from "@/models/api/common";

export interface GetTokenTransactionsResponse {
  items: TransactionTableModel[];
  page: {
    cursor: string;
    hasNext: boolean;
    nextCursor: string;
  };
}
