import { RealmTransactionModel } from "@/models/api/realm/realm-model";

export interface GetRealmTransactionsResponse {
  items: RealmTransactionModel[];

  page: {
    cursor: string;
    hasNext: boolean;
    nextCursor: string;
  };
}
