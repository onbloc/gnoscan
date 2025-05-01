import { NetworkClient } from "@/common/clients/network-client";
import { ApiTokenRepository } from "./api-token-repository";

import { GetTokensRequestParameters } from "./request";
import { GetTokenResponse, GetTokensResponse, GetTokenTransactionsResponse } from "./response";
import { makeQueryParameter } from "@/common/utils/string-util";
import { CommonError } from "@/common/errors";

interface APIResponse<T> {
  data: T;
}

export class ApiTokenRepositoryImpl implements ApiTokenRepository {
  private networkClient: NetworkClient | null;
  constructor(networkClient: NetworkClient | null) {
    this.networkClient = networkClient;
  }

  getTokens(params: GetTokensRequestParameters): Promise<GetTokensResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    const requestParams = makeQueryParameter({ ...params });

    return this.networkClient
      .get<APIResponse<GetTokensResponse>>({
        url: `/tokens${requestParams}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getToken(tokenId: string): Promise<GetTokenResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<GetTokenResponse>>({
        url: `tokens/${tokenId}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getTokenTransactions(tokenId: string): Promise<GetTokenTransactionsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<GetTokenTransactionsResponse>>({
        url: `tokens/${tokenId}/transactions`,
      })
      .then(result => {
        return result.data?.data;
      });
  }
}
