import {
  GetAccountDirectTransactionsRequest,
  GetAccountNativeTransfersRequest,
  GetAccountTokenTransfersRequest,
  GetAccountsRequest,
} from "./request";
import {
  GetAccountDirectTransactionsResponse,
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
}
