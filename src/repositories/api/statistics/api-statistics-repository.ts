import { GetTotalFeeShareRequest, GetTotalRealmStorageDepositRequest } from "./request";
import {
  GetLatestBlogsResponse,
  GetMonthlyActiveAccountsResponse,
  GetNewestRealmsResponse,
  GetStorageDepositResponse,
  GetSummaryAccountsResponse,
  GetSummaryBlocksResponse,
  GetSummarySupplyResponse,
  GetGnotPriceResponse,
  GetSummaryTransactionsResponse,
  GetTotalDailyFeesResponse,
  GetTotalDailyStorageDepositResponse,
  GetTotalDailyTransactionsResponse,
  GetTotalFeeShareResponse,
  GetTotalRealmStorageDepositResponse,
} from "./response";

export interface ApiStatisticsRepository {
  getLatestBlogs(): Promise<GetLatestBlogsResponse>;

  getMonthlyActiveAccounts(): Promise<GetMonthlyActiveAccountsResponse>;

  getNewestRealms(): Promise<GetNewestRealmsResponse>;

  getSummaryAccounts(): Promise<GetSummaryAccountsResponse>;

  getSummaryBlocks(): Promise<GetSummaryBlocksResponse>;

  getSummarySupply(): Promise<GetSummarySupplyResponse>;

  getGnotPrice(): Promise<GetGnotPriceResponse>;

  getSummaryTransactions(): Promise<GetSummaryTransactionsResponse>;

  getTotalDailyFees(): Promise<GetTotalDailyFeesResponse>;

  getTotalDailyTransactions(): Promise<GetTotalDailyTransactionsResponse>;

  getTotalGasShare(request: GetTotalFeeShareRequest): Promise<GetTotalFeeShareResponse>;

  getStorageDeposit(): Promise<GetStorageDepositResponse>;

  getTotalDailyRealmStorageDeposit(
    request: GetTotalRealmStorageDepositRequest,
  ): Promise<GetTotalRealmStorageDepositResponse>;

  getTotalDailyStorageDeposit(): Promise<GetTotalDailyStorageDepositResponse>;
}
