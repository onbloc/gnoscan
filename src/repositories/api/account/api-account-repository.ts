import {
  GetAccountDirectTransactionsRequest,
  GetAccountNativeTransfersRequest,
  GetAccountTokenTransfersRequest,
} from "./request";
import {
  GetAccountDirectTransactionsResponse,
  GetAccountNativeTransfersResponse,
  GetAccountResponse,
  GetAccountTokenTransfersResponse,
} from "./response";

export interface ApiAccountRepository {
  getAccount(address: string): Promise<GetAccountResponse>;

  getAccountDirectTransactions(
    params: GetAccountDirectTransactionsRequest,
  ): Promise<GetAccountDirectTransactionsResponse>;

  getAccountNativeTransfers(params: GetAccountNativeTransfersRequest): Promise<GetAccountNativeTransfersResponse>;

  getAccountTokenTransfers(params: GetAccountTokenTransfersRequest): Promise<GetAccountTokenTransfersResponse>;
}
