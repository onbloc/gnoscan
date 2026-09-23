import { NetworkClient } from "@/common/clients/network-client";
import { ApiTokenRepository } from "./api-token-repository";

import {
  GetTokenHoldersRequest,
  GetTokensRequestParameters,
  GetTokenTransfersRequest,
  GetTokenMetaTransactionsRequest,
  GetTokenMetaInternalTransactionsRequest,
  GetTokenEventsRequest,
} from "./request";
import {
  GetTokenHoldersResponse,
  GetTokenMetaByPathResponse,
  GetTokenResponse,
  GetTokensResponse,
  GetTokenTransfersResponse,
  GetTokenMetaTransactionsResponse,
  GetTokenMetaInternalTransactionsResponse,
  GetTokenEventsResponse,
} from "./response";
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

  getTokenTransfers(params: GetTokenTransfersRequest): Promise<GetTokenTransfersResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    const { path, ...queryParams } = params;
    const requestParams = makeQueryParameter({ ...queryParams });

    return this.networkClient
      .get<APIResponse<GetTokenTransfersResponse>>({
        url: `tokens/${encodeURIComponent(path)}/transactions${requestParams}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getTokenHolders(params: GetTokenHoldersRequest): Promise<GetTokenHoldersResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    const { path, ...queryParams } = params;
    const requestParams = makeQueryParameter({ ...queryParams });

    return this.networkClient
      .get<APIResponse<GetTokenHoldersResponse>>({
        url: `tokens/${encodeURIComponent(path)}/holders${requestParams}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getTokenMetaByPath(path: string): Promise<GetTokenMetaByPathResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<GetTokenMetaByPathResponse>>({
        url: `token-meta/${encodeURIComponent(path)}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getTokenMetaTransactions(params: GetTokenMetaTransactionsRequest): Promise<GetTokenMetaTransactionsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    const { path, ...queryParams } = params;
    const requestParams = makeQueryParameter({ ...queryParams });

    return this.networkClient
      .get<APIResponse<GetTokenMetaTransactionsResponse>>({
        url: `token-meta/${encodeURIComponent(path)}/transactions${requestParams}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getTokenMetaInternalTransactions(
    params: GetTokenMetaInternalTransactionsRequest,
  ): Promise<GetTokenMetaInternalTransactionsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    const { path, ...queryParams } = params;
    const requestParams = makeQueryParameter({ ...queryParams });

    return this.networkClient
      .get<APIResponse<GetTokenMetaInternalTransactionsResponse>>({
        url: `token-meta/${encodeURIComponent(path)}/internal-transactions${requestParams}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getTokenEvents(params: GetTokenEventsRequest): Promise<GetTokenEventsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    const { path, ...queryParams } = params;
    const requestParams = makeQueryParameter({ ...queryParams });

    return this.networkClient
      .get<APIResponse<GetTokenEventsResponse>>({
        url: `tokens/${encodeURIComponent(path)}/events${requestParams}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }
}
