import { GetAccountEventsRequest, GetAccountTransactionsRequest } from "./request";
import { GetAccountEventsResponse, GetAccountResponse, GetAccountTransactionsResponse } from "./response";

export interface ApiAccountRepository {
  getAccount(address: string): Promise<GetAccountResponse>;

  getAccountEvents(params: GetAccountEventsRequest): Promise<GetAccountEventsResponse>;

  getAccountTransactions(params: GetAccountTransactionsRequest): Promise<GetAccountTransactionsResponse>;
}
