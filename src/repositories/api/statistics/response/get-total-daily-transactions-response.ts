export interface GetTotalDailyTransactionsResponse {
  items: {
    date: string;
    txCount: number;
  }[];
}
