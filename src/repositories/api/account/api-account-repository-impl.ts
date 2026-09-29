import { NetworkClient } from "@/common/clients/network-client";
import { ApiAccountRepository } from "./api-account-repository";

import {
  GetAccountDirectTransactionsRequest,
  GetAccountNativeTransfersRequest,
  GetAccountTokenTransfersRequest,
} from "./request";
import {
  GetAccountDirectTransactionsResponse,
  GetAccountNativeTransfersResponse,
  GetAccountResponse,
  GetAccountTokenTransfersResponse,
} from "./response";
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

  getAccountDirectTransactions(
    params: GetAccountDirectTransactionsRequest,
  ): Promise<GetAccountDirectTransactionsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    const { address, ...queryParams } = params;
    const requestParams = makeQueryParameter(queryParams);

    return this.networkClient
      .get<APIResponse<GetAccountDirectTransactionsResponse>>({
        url: `accounts/${address}/direct-transactions${requestParams}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getAccountNativeTransfers(params: GetAccountNativeTransfersRequest): Promise<GetAccountNativeTransfersResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    const { address, ...queryParams } = params;
    const requestParams = makeQueryParameter(queryParams);

    return this.networkClient
      .get<APIResponse<GetAccountNativeTransfersResponse>>({
        url: `accounts/${address}/native-transfers${requestParams}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getAccountTokenTransfers(params: GetAccountTokenTransfersRequest): Promise<GetAccountTokenTransfersResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    const { address, ...queryParams } = params;
    const requestParams = makeQueryParameter(queryParams);

    return this.networkClient
      .get<APIResponse<GetAccountTokenTransfersResponse>>({
        url: `accounts/${address}/token-transfers${requestParams}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }
}
