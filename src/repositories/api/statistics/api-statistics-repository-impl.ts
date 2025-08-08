import { NetworkClient } from "@/common/clients/network-client";
import { NodeRPCClient } from "@/common/clients/node-client";
import { ApiStatisticsRepository } from "./api-statistics-repository";

import { CommonError } from "@/common/errors";
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
  GetTotalFeeShareResponse,
} from "./response";
import { StorageDeposit } from "@/models/storage-deposit-model";
import { GNO_PACKAGE_BOARD_PATH } from "@/common/values/gno.constant";
import { makeQueryParameter } from "@/common/utils/string-util";
import { isValidStorageDepositData } from "@/common/utils/storage-deposit-util";
import { parseABCIKeyValueResponse } from "@/common/clients/node-client/utility";

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

  async getTotalStorageDeposit(): Promise<StorageDeposit | null> {
    if (!this.nodeClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NodeRPCClient");
    }

    const response = await this.nodeClient.abciQueryVMStorageDeposit(GNO_PACKAGE_BOARD_PATH).catch(() => null);
    if (!response || !response?.response?.ResponseBase?.Data) {
      return null;
    }

    try {
      const rawResult = parseABCIKeyValueResponse(response.response.ResponseBase.Data);

      if (isValidStorageDepositData(rawResult)) {
        return {
          storage: rawResult.storage,
          deposit: rawResult.deposit,
        };
      }

      return null;
    } catch {
      return null;
    }
  }
}
