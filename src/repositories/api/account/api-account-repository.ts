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

export interface ApiAccountRepository {
  getAccount(address: string): Promise<GetAccountResponse>;

  getAccounts(params: GetAccountsRequest): Promise<GetAccountsResponse>;

  getAccountDirectTransactions(
    params: GetAccountDirectTransactionsRequest,
  ): Promise<GetAccountDirectTransactionsResponse>;

  getAccountNativeTransfers(params: GetAccountNativeTransfersRequest): Promise<GetAccountNativeTransfersResponse>;

  getAccountTokenTransfers(params: GetAccountTokenTransfersRequest): Promise<GetAccountTokenTransfersResponse>;

  getAccountGRC721Collections(address: string): Promise<GetAccountGRC721CollectionsResponse>;

  getAccountGRC721CollectionItems(
    params: GetAccountGRC721CollectionItemsRequest,
  ): Promise<GetAccountGRC721CollectionItemsResponse>;
}
