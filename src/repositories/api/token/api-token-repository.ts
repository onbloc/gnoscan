import {
  GetTokenHoldersRequest,
  GetTokensRequestParameters,
  GetTokenTransfersRequest,
  GetTokenMetaTransactionsRequest,
  GetTokenMetaInternalTransactionsRequest,
  GetTokenEventsRequest,
  GetNftCollectionsRequest,
  GetNftCollectionItemsRequest,
  GetNftCollectionHoldersRequest,
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
  GetNftCollectionHoldersResponse,
} from "./response";

export interface ApiTokenRepository {
  getTokens(params: GetTokensRequestParameters): Promise<GetTokensResponse>;

  getToken(tokenId: string): Promise<GetTokenResponse>;

  getTokenTransfers(params: GetTokenTransfersRequest): Promise<GetTokenTransfersResponse>;

  getTokenHolders(params: GetTokenHoldersRequest): Promise<GetTokenHoldersResponse>;

  getTokenMetaByPath(path: string): Promise<GetTokenMetaByPathResponse>;

  getTokenMetaTransactions(params: GetTokenMetaTransactionsRequest): Promise<GetTokenMetaTransactionsResponse>;

  getTokenMetaInternalTransactions(
    params: GetTokenMetaInternalTransactionsRequest,
  ): Promise<GetTokenMetaInternalTransactionsResponse>;

  getTokenEvents(params: GetTokenEventsRequest): Promise<GetTokenEventsResponse>;

  getNftCollections(params: GetNftCollectionsRequest): Promise<GetNftCollectionsResponse>;

  getNftCollection(tokenKey: string): Promise<GetNftCollectionResponse>;

  getNftCollectionItems(params: GetNftCollectionItemsRequest): Promise<GetNftCollectionItemsResponse>;

  getNftCollectionHolders(params: GetNftCollectionHoldersRequest): Promise<GetNftCollectionHoldersResponse>;
}
