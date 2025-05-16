import { GetTokensRequestParameters, GetTokenTransactionsRequest } from "./request";
import { GetTokenResponse, GetTokensResponse, GetTokenTransactionsResponse } from "./response";

export interface ApiTokenRepository {
  getTokens(params: GetTokensRequestParameters): Promise<GetTokensResponse>;

  getToken(tokenId: string): Promise<GetTokenResponse>;

  getTokenTransactions(params: GetTokenTransactionsRequest): Promise<GetTokenTransactionsResponse>;
}
