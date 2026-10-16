import { ApiAccountRepository } from "./api-account-repository";

import {
  GetAccountDirectTransactionsRequest,
  GetAccountGRC721CollectionItemsRequest,
  GetAccountNativeTransfersRequest,
  GetAccountTokenTransfersRequest,
  GetAccountsRequest,
} from "./request";
import {
  GetAccountDirectTransactionsResponse,
  GetAccountGRC721CollectionItemsResponse,
  GetAccountGRC721CollectionsResponse,
  GetAccountNativeTransfersResponse,
  GetAccountResponse,
  GetAccountTokenTransfersResponse,
  GetAccountsResponse,
} from "./response";
import { ApiRepository } from "../api-repository";

export class ApiAccountRepositoryImpl extends ApiRepository implements ApiAccountRepository {
  getAccount(address: string): Promise<GetAccountResponse> {
    return this.get<GetAccountResponse>(`accounts/${address}`);
  }

  getAccounts(params: GetAccountsRequest): Promise<GetAccountsResponse> {
    return this.get<GetAccountsResponse>("native/holders", { ...params });
  }

  getAccountDirectTransactions(
    params: GetAccountDirectTransactionsRequest,
  ): Promise<GetAccountDirectTransactionsResponse> {
    const { address, ...queryParams } = params;
    return this.get<GetAccountDirectTransactionsResponse>(`accounts/${address}/direct-transactions`, queryParams);
  }

  getAccountNativeTransfers(params: GetAccountNativeTransfersRequest): Promise<GetAccountNativeTransfersResponse> {
    const { address, ...queryParams } = params;
    return this.get<GetAccountNativeTransfersResponse>(`accounts/${address}/native-transfers`, queryParams);
  }

  getAccountTokenTransfers(params: GetAccountTokenTransfersRequest): Promise<GetAccountTokenTransfersResponse> {
    const { address, ...queryParams } = params;
    return this.get<GetAccountTokenTransfersResponse>(`accounts/${address}/token-transfers`, queryParams);
  }

  getAccountGRC721Collections(address: string): Promise<GetAccountGRC721CollectionsResponse> {
    return this.get<GetAccountGRC721CollectionsResponse>(`accounts/${address}/grc721-tokens`);
  }

  getAccountGRC721CollectionItems(
    params: GetAccountGRC721CollectionItemsRequest,
  ): Promise<GetAccountGRC721CollectionItemsResponse> {
    const { address, tokenId, ...queryParams } = params;
    return this.get<GetAccountGRC721CollectionItemsResponse>(
      `accounts/${address}/grc721-tokens/${encodeURIComponent(tokenId)}/items`,
      queryParams,
    );
  }
}
