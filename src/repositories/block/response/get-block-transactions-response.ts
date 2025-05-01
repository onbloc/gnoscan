import { BlockTransactionModel } from "@/models/api/block/block-transaction-model";

export interface GetBlockTransactionsResponse {
  items: BlockTransactionModel[];

  page: string;
}
