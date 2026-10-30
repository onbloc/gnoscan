import { TransactionDateFilter } from "@/repositories/api/transaction/request";

export interface GetAccountTokenTransfersRequest extends TransactionDateFilter {
  address: string;

  cursor?: string;

  limit?: number;
}
