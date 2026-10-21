import { ApiTokenRepository } from "./api-token-repository";

import {
  GetTokenHoldersRequest,
  GetTokensRequestParameters,
  GetTokenTransfersRequest,
  GetTokenMetaTransactionsRequest,
  GetTokenMetaInternalTransactionsRequest,
  GetTokenEventsRequest,
  GetNftCollectionsRequest,
  GetNftCollectionItemsRequest,
  GetNftItemTransfersRequest,
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
  GetNftCollectionsResponse,
  GetNftCollectionResponse,
  GetNftCollectionItemsResponse,
  GetNftItemDetailResponse,
  GetNftItemTransfersResponse,
  GetNftTokenDetailResponse,
  GetNftTokenUrisResponse,
} from "./response";
import { encodeQueryValue, makeEncodedQueryParameter } from "@/common/utils/string-util";
import { ApiRepository } from "../api-repository";

export class ApiTokenRepositoryImpl extends ApiRepository implements ApiTokenRepository {
  getTokens(params: GetTokensRequestParameters): Promise<GetTokensResponse> {
    return this.get<GetTokensResponse>("/tokens", { ...params, keyword: encodeQueryValue(params.keyword) });
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

  getNftCollections(params: GetNftCollectionsRequest): Promise<GetNftCollectionsResponse> {
    return this.get<GetNftCollectionsResponse>(`nft-collections${makeEncodedQueryParameter({ ...params })}`);
  }

  getNftCollection(tokenKey: string): Promise<GetNftCollectionResponse> {
    return this.get<GetNftCollectionResponse>(`nft-collections/${encodeURIComponent(tokenKey)}`);
  }

  getNftCollectionItems(params: GetNftCollectionItemsRequest): Promise<GetNftCollectionItemsResponse> {
    const { tokenKey, ...queryParams } = params;
    return this.get<GetNftCollectionItemsResponse>(
      `nft-collections/${encodeURIComponent(tokenKey)}/items`,
      queryParams,
    );
  }

  getNftItemDetail(tokenKey: string, nftId: string): Promise<GetNftItemDetailResponse> {
    return this.get<GetNftItemDetailResponse>(
      `nft-collections/${encodeURIComponent(tokenKey)}/items/${encodeURIComponent(nftId)}`,
    );
  }

  getNftItemTransfers(params: GetNftItemTransfersRequest): Promise<GetNftItemTransfersResponse> {
    const { tokenKey, nftId, page = 1, limit = 5 } = params;
    return this.get<GetNftItemTransfersResponse>(
      `nft-collections/${encodeURIComponent(tokenKey)}/items/${encodeURIComponent(nftId)}/transfers`,
      { page, limit },
    );
  }

  getNftTokenUris(packagePath: string, nftIds: string[], refresh = false): Promise<GetNftTokenUrisResponse> {
    return this.get<GetNftTokenUrisResponse>(`realms/${encodeURIComponent(packagePath)}/nft-items/uris`, {
      tokenIds: nftIds.join(","),
      refresh,
    });
  }

  getNftTokenDetail(packagePath: string, nftId: string, refresh = false): Promise<GetNftTokenDetailResponse> {
    return this.get<GetNftTokenDetailResponse>(
      `realms/${encodeURIComponent(packagePath)}/nft-items/${encodeURIComponent(nftId)}/metadata`,
      { refresh },
    );
  }
}
