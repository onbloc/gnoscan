export interface ActiveAccountModel {
  account: string;
  accountName: string;
  balance: string;
  nonTransferTxs: number;
  totalTxs: number;
}

export interface GetMonthlyActiveAccountsResponse {
  items: ActiveAccountModel[];

  lastUpdated: string;
}
