import { TransactionModel } from "@/models/api/transaction/transaction-model";

export interface GetTransactionsResponse {
  items: TransactionModel[];

  page: {
    cursor: string;
    hasNext: boolean;
  };
}
