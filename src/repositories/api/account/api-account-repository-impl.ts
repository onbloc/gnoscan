import { ApiAccountRepository } from "./api-account-repository";

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
}
