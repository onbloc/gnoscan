import {
  GetLatestBlogsResponse,
  GetMonthlyActiveAccountsResponse,
  GetNewestRealmsResponse,
  GetSummaryAccountsResponse,
  GetSummaryBlocksResponse,
  GetSummarySupplyResponse,
  GetSummaryTransactionsResponse,
  GetTotalDailyFeesResponse,
  GetTotalDailyTransactionsResponse,
  GetTotalGasShareResponse,
} from "./response";

export interface ApiStatisticsRepository {
  getLatestBlogs(): Promise<GetLatestBlogsResponse>;

  getMonthlyActiveAccounts(): Promise<GetMonthlyActiveAccountsResponse>;

  getNewestRealms(): Promise<GetNewestRealmsResponse>;

  getSummaryAccounts(): Promise<GetSummaryAccountsResponse>;

  getSummaryBlocks(): Promise<GetSummaryBlocksResponse>;

  getSummarySupply(): Promise<GetSummarySupplyResponse>;

  getSummaryTransactions(): Promise<GetSummaryTransactionsResponse>;

  getTotalDailyFees(): Promise<GetTotalDailyFeesResponse>;

  getTotalDailyTransactions(): Promise<GetTotalDailyTransactionsResponse>;

  getTotalGasShare(): Promise<GetTotalGasShareResponse>;
}
