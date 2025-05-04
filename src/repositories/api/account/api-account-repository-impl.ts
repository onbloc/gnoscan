import { NetworkClient } from "@/common/clients/network-client";
import { ApiAccountRepository } from "./api-account-repository";

import { GetAccountEventsRequest, GetAccountTransactionsRequest } from "./request";
import { GetAccountEventsResponse, GetAccountResponse, GetAccountTransactionsResponse } from "./response";
import { makeQueryParameter } from "@/common/utils/string-util";
import { CommonError } from "@/common/errors";

interface APIResponse<T> {
  data: T;
}

export class ApiAccountRepositoryImpl implements ApiAccountRepository {
  private networkClient: NetworkClient | null;
  constructor(networkClient: NetworkClient | null) {
    this.networkClient = networkClient;
  }

  getAccount(address: string): Promise<GetAccountResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<GetAccountResponse>>({
        url: `accounts/${address}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getAccountEvents(params: GetAccountEventsRequest): Promise<GetAccountEventsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    const { address, ...queryParams } = params;
    const requestParams = makeQueryParameter(queryParams);

    return this.networkClient
      .get<APIResponse<GetAccountEventsResponse>>({
        url: `accounts/${address}/events${requestParams}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getAccountTransactions(params: GetAccountTransactionsRequest): Promise<GetAccountTransactionsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    const { address, ...queryParams } = params;
    const requestParams = makeQueryParameter(queryParams);

    return this.networkClient
      .get<APIResponse<GetAccountTransactionsResponse>>({
        url: `accounts/${address}/transactions${requestParams}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }
}
