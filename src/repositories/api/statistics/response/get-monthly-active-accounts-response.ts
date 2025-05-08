export interface ActiveAccountModel {
  account: string;
  balance: string;
  nonTransferTxs: number;
  totalTxs: number;
}

export interface GetMonthlyActiveAccountsResponse {
  items: ActiveAccountModel[];

  lastUpdated: string;
}
