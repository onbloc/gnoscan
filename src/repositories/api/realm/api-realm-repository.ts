import { GetRealmsRequestParameters, GetRealmEventsRequest, GetRealmTransactionsRequest } from "./request";
import { GetRealmEventsResponse, GetRealmResponse, GetRealmsResponse, GetRealmTransactionsResponse } from "./response";
import { StorageDeposit } from "@/models/storage-deposit-model";
export interface ApiRealmRepository {
  getRealms(params: GetRealmsRequestParameters): Promise<GetRealmsResponse>;

  getRealm(path: string): Promise<GetRealmResponse>;

  getRealmStorageDeposit(path: string): Promise<StorageDeposit | null>;

  getRealmEvents(params: GetRealmEventsRequest): Promise<GetRealmEventsResponse>;

  getRealmTransactions(params: GetRealmTransactionsRequest): Promise<GetRealmTransactionsResponse>;
}
