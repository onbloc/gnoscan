import { GetTotalFeeShareRequest } from "./request";
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
  GetTotalFeeShareResponse,
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

  getTotalGasShare(request: GetTotalFeeShareRequest): Promise<GetTotalFeeShareResponse>;
}
