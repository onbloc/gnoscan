import { TransactionDateFilter } from "@/repositories/api/transaction/request";

export interface GetAccountNativeTransfersRequest extends TransactionDateFilter {
  address: string;

  cursor?: string;

  limit?: number;
}
