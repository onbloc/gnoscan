import { GetRealmsRequestParameters, GetRealmTransactionsRequest } from "./request";
import { GetRealmEventsResponse, GetRealmResponse, GetRealmsResponse, GetRealmTransactionsResponse } from "./response";

export interface ApiRealmRepository {
  getRealms(params: GetRealmsRequestParameters): Promise<GetRealmsResponse>;

  getRealm(path: string): Promise<GetRealmResponse>;

  getRealmEvents(path: string): Promise<GetRealmEventsResponse>;

  getRealmTransactions(params: GetRealmTransactionsRequest): Promise<GetRealmTransactionsResponse>;
}
