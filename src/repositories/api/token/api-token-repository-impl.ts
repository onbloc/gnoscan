import { NetworkClient } from "@/common/clients/network-client";
import { ApiTokenRepository } from "./api-token-repository";

import { GetTokensRequestParameters, GetTokenTransactionsRequest } from "./request";
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
        url: `tokens/${encodeURIComponent(tokenId)}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getTokenTransactions(params: GetTokenTransactionsRequest): Promise<GetTokenTransactionsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    const { path, ...queryParams } = params;
    const requestParams = makeQueryParameter({ ...queryParams });

    return this.networkClient
      .get<APIResponse<GetTokenTransactionsResponse>>({
        url: `tokens/${encodeURIComponent(path)}/transactions${requestParams}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }
}
