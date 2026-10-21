import { AccountListItemModel } from "@/models/api/account/account-list-item-model";

export interface GetAccountsResponse {
  items: AccountListItemModel[];
  page: {
    hasNext: boolean;
    totalCount: number;
  };
}
