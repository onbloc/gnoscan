import { ApiAccountRepository } from "./api-account-repository";

import {
  GetAccountDirectTransactionsRequest,
  GetAccountGRC721CollectionItemsRequest,
  GetAccountNativeBalanceHistoryRequest,
  GetAccountNativeTransfersRequest,
  GetAccountTokenTransfersRequest,
  GetAccountsRequest,
} from "./request";
import {
  GetAccountDirectTransactionsResponse,
  GetAccountGRC721CollectionItemsResponse,
  GetAccountGRC721CollectionsResponse,
  GetAccountNativeBalanceHistoryResponse,
  GetAccountNativeTransfersResponse,
  GetAccountResponse,
  GetAccountTokenTransfersResponse,
  GetAccountsResponse,
} from "./response";
import { ApiRepository } from "../api-repository";
import { makeEncodedQueryParameter } from "@/common/utils/string-util";

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
    const requestParams = makeEncodedQueryParameter({ ...queryParams });
    return this.get<GetAccountDirectTransactionsResponse>(`accounts/${address}/direct-transactions${requestParams}`);
  }

  getAccountNativeTransfers(params: GetAccountNativeTransfersRequest): Promise<GetAccountNativeTransfersResponse> {
    const { address, ...queryParams } = params;
    return this.get<GetAccountNativeTransfersResponse>(`accounts/${address}/native-transfers`, queryParams);
  }

  getAccountNativeBalanceHistory(
    params: GetAccountNativeBalanceHistoryRequest,
  ): Promise<GetAccountNativeBalanceHistoryResponse> {
    const { address, ...queryParams } = params;
    return this.get<GetAccountNativeBalanceHistoryResponse>(
      `accounts/${address}/native-analytics/balance`,
      queryParams,
    );
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
