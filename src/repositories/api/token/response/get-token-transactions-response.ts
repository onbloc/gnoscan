import { TokenTransactionModel } from "@/models/api/token/token-model";

export interface GetTokenTransactionsResponse {
  items: TokenTransactionModel[];
  page: {
    cursor: string;
    hasNext: boolean;
    nextCursor: string;
  };
}
