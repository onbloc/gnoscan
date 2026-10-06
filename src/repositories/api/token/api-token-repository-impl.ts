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
import { makeEncodedQueryParameter } from "@/common/utils/string-util";
import { ApiRepository } from "../api-repository";

export class ApiTokenRepositoryImpl extends ApiRepository implements ApiTokenRepository {
  getTokens(params: GetTokensRequestParameters): Promise<GetTokensResponse> {
    return this.get<GetTokensResponse>("/tokens", { ...params });
  }

  getToken(tokenId: string): Promise<GetTokenResponse> {
    return this.get<GetTokenResponse>(`tokens/${encodeURIComponent(tokenId)}`);
  }

  getTokenTransfers(params: GetTokenTransfersRequest): Promise<GetTokenTransfersResponse> {
    const { path, ...queryParams } = params;
    return this.get<GetTokenTransfersResponse>(`token-meta/${encodeURIComponent(path)}/token-transfers`, queryParams);
  }

  getTokenHolders(params: GetTokenHoldersRequest): Promise<GetTokenHoldersResponse> {
    const { path, ...queryParams } = params;
    return this.get<GetTokenHoldersResponse>(`tokens/${encodeURIComponent(path)}/holders`, queryParams);
  }

  getTokenMetaByPath(path: string): Promise<GetTokenMetaByPathResponse> {
    return this.get<GetTokenMetaByPathResponse>(`token-meta/${encodeURIComponent(path)}`);
  }

  getTokenMetaTransactions(params: GetTokenMetaTransactionsRequest): Promise<GetTokenMetaTransactionsResponse> {
    const { path, ...queryParams } = params;
    return this.get<GetTokenMetaTransactionsResponse>(
      `token-meta/${encodeURIComponent(path)}/transactions`,
      queryParams,
    );
  }

  getTokenMetaInternalTransactions(
    params: GetTokenMetaInternalTransactionsRequest,
  ): Promise<GetTokenMetaInternalTransactionsResponse> {
    const { path, ...queryParams } = params;
    return this.get<GetTokenMetaInternalTransactionsResponse>(
      `token-meta/${encodeURIComponent(path)}/internal-transactions`,
      queryParams,
    );
  }

  getTokenEvents(params: GetTokenEventsRequest): Promise<GetTokenEventsResponse> {
    const { path, ...queryParams } = params;
    const requestParams = makeEncodedQueryParameter({ ...queryParams });
    return this.get<GetTokenEventsResponse>(`token-meta/${encodeURIComponent(path)}/events${requestParams}`);
  }
}
