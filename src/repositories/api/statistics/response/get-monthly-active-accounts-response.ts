export interface GetMonthlyActiveAccountsResponse {
  items: {
    account: string;
    balance: string;
    nonTransferTxs: number;
    totalTxs: number;
  }[];
  lastUpdated: string;
}
