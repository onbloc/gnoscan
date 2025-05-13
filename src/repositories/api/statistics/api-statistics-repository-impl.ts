import { NetworkClient } from "@/common/clients/network-client";
import { ApiStatisticsRepository } from "./api-statistics-repository";

import { CommonError } from "@/common/errors";
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
  GetTotalGasShareResponse,
} from "./response";

interface APIResponse<T> {
  data: T;
}

export class ApiStatisticsRepositoryImpl implements ApiStatisticsRepository {
  private networkClient: NetworkClient | null;
  constructor(networkClient: NetworkClient | null) {
    this.networkClient = networkClient;
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

  getTotalGasShare(): Promise<GetTotalFeeShareResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<GetTotalFeeShareResponse>>({
        url: "/stats/total-gas-share",
      })
      .then(result => {
        return totalGasShareMockData;
        // return result.data?.data;
      });
  }
}

const totalGasShareMockData: GetTotalFeeShareResponse = {
  items: [
    {
      "2025-05-07": {
        "gno.land/r/demo/wugnot": {
          packagePath: "gno.land/r/demo/wugnot",
          gasShared: 49000,
        },
        "gno.land/r/demo/gns": {
          packagePath: "gno.land/r/demo/gns",
          gasShared: 70000,
        },
      },
      "2025-05-08": {
        "gno.land/r/demo/wugnot": {
          packagePath: "gno.land/r/demo/wugnot",
          gasShared: 47000,
        },
        "gno.land/r/demo/gns": {
          packagePath: "gno.land/r/demo/gns",
          gasShared: 72000,
        },
      },
      "2025-05-09": {
        "gno.land/r/demo/wugnot": {
          packagePath: "gno.land/r/demo/wugnot",
          gasShared: 51000,
        },
        "gno.land/r/demo/gns": {
          packagePath: "gno.land/r/demo/gns",
          gasShared: 69000,
        },
      },
      "2025-05-10": {
        "gno.land/r/demo/wugnot": {
          packagePath: "gno.land/r/demo/wugnot",
          gasShared: 48000,
        },
        "gno.land/r/demo/gns": {
          packagePath: "gno.land/r/demo/gns",
          gasShared: 73000,
        },
      },
      "2025-05-11": {
        "gno.land/r/demo/wugnot": {
          packagePath: "gno.land/r/demo/wugnot",
          gasShared: 52000,
        },
        "gno.land/r/demo/gns": {
          packagePath: "gno.land/r/demo/gns",
          gasShared: 71000,
        },
      },
      "2025-05-12": {
        "gno.land/r/demo/wugnot": {
          packagePath: "gno.land/r/demo/wugnot",
          gasShared: 45000,
        },
        "gno.land/r/demo/gns": {
          packagePath: "gno.land/r/demo/gns",
          gasShared: 68000,
        },
      },
      "2025-05-13": {
        "gno.land/r/demo/wugnot": {
          packagePath: "gno.land/r/demo/wugnot",
          gasShared: 500000,
        },
        "gno.land/r/demo/gns": {
          packagePath: "gno.land/r/demo/gns",
          gasShared: 75000,
        },
      },
    },
  ],

  lastUpdated: "2025-05-13T15:35:00Z",
};
