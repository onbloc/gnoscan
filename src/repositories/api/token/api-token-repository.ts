import { GetTokenHoldersRequest, GetTokensRequestParameters, GetTokenTransactionsRequest } from "./request";
import {
  GetTokenHoldersResponse,
  GetTokenMetaByPathResponse,
  GetTokenResponse,
  GetTokensResponse,
  GetTokenTransactionsResponse,
} from "./response";

export interface ApiTokenRepository {
  getTokens(params: GetTokensRequestParameters): Promise<GetTokensResponse>;

  getToken(tokenId: string): Promise<GetTokenResponse>;

  getTokenTransactions(params: GetTokenTransactionsRequest): Promise<GetTokenTransactionsResponse>;

  getTokenHolders(params: GetTokenHoldersRequest): Promise<GetTokenHoldersResponse>;

  getTokenMetaByPath(path: string): Promise<GetTokenMetaByPathResponse>;
}
