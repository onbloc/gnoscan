import { NetworkClient } from "@/common/clients/network-client";
import { NodeRPCClient } from "@/common/clients/node-client";
import { ApiStatisticsRepository } from "./api-statistics-repository";

import { GetTotalFeeShareRequest, GetTotalRealmStorageDepositRequest } from "./request";
import {
  GetLatestBlogsResponse,
  GetMonthlyActiveAccountsResponse,
  GetNewestRealmsResponse,
  GetStorageDepositResponse,
  GetSummaryAccountsResponse,
  GetSummaryBlocksResponse,
  GetSummarySupplyResponse,
  GetSummaryTransactionsResponse,
  GetTotalDailyFeesResponse,
  GetTotalDailyStorageDepositResponse,
  GetTotalDailyTransactionsResponse,
  GetTotalFeeShareResponse,
  GetTotalRealmStorageDepositResponse,
} from "./response";
import { ApiRepository } from "../api-repository";

export class ApiStatisticsRepositoryImpl extends ApiRepository implements ApiStatisticsRepository {
  private nodeClient: NodeRPCClient | null;
  constructor(networkClient: NetworkClient | null, nodeClient: NodeRPCClient | null) {
    super(networkClient);
    this.nodeClient = nodeClient;
  }

  getLatestBlogs(): Promise<GetLatestBlogsResponse> {
    return this.get<GetLatestBlogsResponse>("/stats/latest-blogs");
  }

  getMonthlyActiveAccounts(): Promise<GetMonthlyActiveAccountsResponse> {
    return this.get<GetMonthlyActiveAccountsResponse>("/stats/monthly-active-accounts");
  }

  getNewestRealms(): Promise<GetNewestRealmsResponse> {
    return this.get<GetNewestRealmsResponse>("/stats/newest-realms");
  }

  getSummaryAccounts(): Promise<GetSummaryAccountsResponse> {
    return this.get<GetSummaryAccountsResponse>("/stats/summary/accounts");
  }

  getSummaryBlocks(): Promise<GetSummaryBlocksResponse> {
    return this.get<GetSummaryBlocksResponse>("/stats/summary/blocks");
  }

  getSummarySupply(): Promise<GetSummarySupplyResponse> {
    return this.get<GetSummarySupplyResponse>("/stats/summary/supply");
  }

  getSummaryTransactions(): Promise<GetSummaryTransactionsResponse> {
    return this.get<GetSummaryTransactionsResponse>("/stats/summary/transactions");
  }

  getTotalDailyFees(): Promise<GetTotalDailyFeesResponse> {
    return this.get<GetTotalDailyFeesResponse>("/stats/total-daily-fees");
  }

  getTotalDailyTransactions(): Promise<GetTotalDailyTransactionsResponse> {
    return this.get<GetTotalDailyTransactionsResponse>("/stats/total-daily-transactions");
  }

  getTotalDailyStorageDeposit(): Promise<GetTotalDailyStorageDepositResponse> {
    return this.get<GetTotalDailyStorageDepositResponse>("/stats/total-daily-storage-deposit");
  }

  getTotalGasShare(params: GetTotalFeeShareRequest): Promise<GetTotalFeeShareResponse> {
    return this.get<GetTotalFeeShareResponse>("/stats/total-gas-share", { ...params });
  }

  getStorageDeposit(): Promise<GetStorageDepositResponse> {
    return this.get<GetStorageDepositResponse>("/stats/summary/storage-deposit");
  }

  getTotalDailyRealmStorageDeposit(
    params: GetTotalRealmStorageDepositRequest,
  ): Promise<GetTotalRealmStorageDepositResponse> {
    return this.get<GetTotalRealmStorageDepositResponse>("/stats/total-daily-realm-storage-deposit", { ...params });
  }
}
