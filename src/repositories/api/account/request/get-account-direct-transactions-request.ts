import { TransactionFilter } from "@/repositories/api/transaction/request";

export interface GetAccountDirectTransactionsRequest extends TransactionFilter {
  address: string;

  cursor?: string;

  limit?: number;
}
