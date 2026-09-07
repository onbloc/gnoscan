import { GetAccountEventsRequest, GetAccountsRequest, GetAccountTransactionsRequest } from "./request";
import {
  GetAccountEventsResponse,
  GetAccountResponse,
  GetAccountsResponse,
  GetAccountTransactionsResponse,
} from "./response";

export interface ApiAccountRepository {
  getAccount(address: string): Promise<GetAccountResponse>;

  getAccounts(params: GetAccountsRequest): Promise<GetAccountsResponse>;

  getAccountEvents(params: GetAccountEventsRequest): Promise<GetAccountEventsResponse>;

  getAccountTransactions(params: GetAccountTransactionsRequest): Promise<GetAccountTransactionsResponse>;
}
