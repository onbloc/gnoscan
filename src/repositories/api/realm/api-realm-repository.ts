import { GetRealmsRequestParameters, GetRealmEventsRequest, GetRealmTransactionsRequest } from "./request";
import { GetRealmEventsResponse, GetRealmResponse, GetRealmsResponse, GetRealmTransactionsResponse } from "./response";

export interface ApiRealmRepository {
  getRealms(params: GetRealmsRequestParameters): Promise<GetRealmsResponse>;

  getRealm(path: string): Promise<GetRealmResponse>;

  getRealmEvents(params: GetRealmEventsRequest): Promise<GetRealmEventsResponse>;

  getRealmTransactions(params: GetRealmTransactionsRequest): Promise<GetRealmTransactionsResponse>;
}
