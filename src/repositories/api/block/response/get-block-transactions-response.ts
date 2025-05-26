import { TransactionTableModel } from "@/models/api/common/transaction-table-model";

export interface GetBlockTransactionsResponse {
  items: TransactionTableModel[];

  page: {
    cursor: string;
    hasNext: boolean;
  };
}
