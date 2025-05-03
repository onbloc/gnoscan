import { NetworkClient } from "@/common/clients/network-client";
import { ApiTransactionRepository } from "./api-transaction-repository";

import { GetTransactionsRequestParameters } from "./request";
import {
  GetTransactionsResponse,
  GetTransactionResponse,
  GetTransactionContractsResponse,
  GetTransactionEventsResponse,
} from "./response";
import { makeQueryParameter } from "@/common/utils/string-util";
import { CommonError } from "@/common/errors";

interface APIResponse<T> {
  data: T;
}

export class ApiTransactionRepositoryImpl implements ApiTransactionRepository {
  private networkClient: NetworkClient | null;
  constructor(networkClient: NetworkClient | null) {
    this.networkClient = networkClient;
  }

  getTransactions(params: GetTransactionsRequestParameters): Promise<GetTransactionsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    const requestParams = makeQueryParameter({ ...params });

    return this.networkClient
      .get<APIResponse<GetTransactionsResponse>>({
        url: `transactions${requestParams}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getTransaction(hash: string): Promise<GetTransactionResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<GetTransactionResponse>>({
        url: `transactions/${encodeURIComponent(hash)}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getTransactionContracts(hash: string): Promise<GetTransactionContractsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<GetTransactionContractsResponse>>({
        url: `transactions/${encodeURIComponent(hash)}/contracts`,
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getTransactionEvents(hash: string): Promise<GetTransactionEventsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<GetTransactionEventsResponse>>({
        url: `transactions/${hash}/events`,
      })
      .then(result => {
        return result.data?.data;
      });
  }
}
