import { NetworkClient } from "@/common/clients/network-client";
import { NodeRPCClient } from "@/common/clients/node-client";
import { ApiStatisticsRepository } from "./api-statistics-repository";

import { CommonError } from "@/common/errors";
import { GetTotalFeeShareRequest } from "./request";
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
  GetTotalDailyTransactionsResponse,
  GetTotalFeeShareResponse,
} from "./response";
import { makeQueryParameter } from "@/common/utils/string-util";

interface APIResponse<T> {
  data: T;
}

export class ApiStatisticsRepositoryImpl implements ApiStatisticsRepository {
  private networkClient: NetworkClient | null;
  private nodeClient: NodeRPCClient | null;
  constructor(networkClient: NetworkClient | null, nodeClient: NodeRPCClient | null) {
    this.networkClient = networkClient;
    this.nodeClient = nodeClient;
  }

  getLatestBlogs(): Promise<GetLatestBlogsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<GetLatestBlogsResponse>>({
        url: "/stats/latest-blogs",
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getMonthlyActiveAccounts(): Promise<GetMonthlyActiveAccountsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<GetMonthlyActiveAccountsResponse>>({
        url: "/stats/monthly-active-accounts",
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getNewestRealms(): Promise<GetNewestRealmsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<GetNewestRealmsResponse>>({
        url: "/stats/newest-realms",
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getSummaryAccounts(): Promise<GetSummaryAccountsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<GetSummaryAccountsResponse>>({
        url: "/stats/summary/accounts",
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getSummaryBlocks(): Promise<GetSummaryBlocksResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<GetSummaryBlocksResponse>>({
        url: "/stats/summary/blocks",
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getSummarySupply(): Promise<GetSummarySupplyResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<GetSummarySupplyResponse>>({
        url: "/stats/summary/supply",
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getSummaryTransactions(): Promise<GetSummaryTransactionsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<GetSummaryTransactionsResponse>>({
        url: "/stats/summary/transactions",
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getTotalDailyFees(): Promise<GetTotalDailyFeesResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<GetTotalDailyFeesResponse>>({
        url: "/stats/total-daily-fees",
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getTotalDailyTransactions(): Promise<GetTotalDailyTransactionsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<GetTotalDailyTransactionsResponse>>({
        url: "/stats/total-daily-transactions",
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getTotalGasShare(params: GetTotalFeeShareRequest): Promise<GetTotalFeeShareResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    const requestParams = makeQueryParameter({ ...params });

    return this.networkClient
      .get<APIResponse<GetTotalFeeShareResponse>>({
        url: `/stats/total-gas-share${requestParams}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getStorageDeposit(): Promise<GetStorageDepositResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<GetStorageDepositResponse>>({
        url: "/stats/summary/storage-deposit",
      })
      .then(result => {
        return result.data?.data;
      });
  }
}
