import { NetworkClient } from "@/common/clients/network-client";
import { ApiTransactionRepository } from "./api-transaction-repository";

import { GetTransactionsRequestParameters } from "./request";
import { GetTransactionsResponse, GetTransactionResponse } from "./response";
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

  getTransactions(params: GetTransactionsRequestParameters) {
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

  getTransaction(hash: string) {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<GetTransactionResponse>>({
        url: `transactions/${hash}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }
}
