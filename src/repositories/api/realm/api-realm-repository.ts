import { GetRealmsRequestParameters, GetRealmEventsRequest, GetRealmTransactionsRequest } from "./request";
import {
  GetRealmEventsResponse,
  GetRealmResponse,
  GetRealmsResponse,
  GetRealmTransactionsResponse,
  GetRealmTokenTransfersResponse,
} from "./response";
import { StorageDeposit } from "@/models/storage-deposit-model";
export interface ApiRealmRepository {
  getRealms(params: GetRealmsRequestParameters): Promise<GetRealmsResponse>;

  getRealm(path: string): Promise<GetRealmResponse>;

  getRealmStorageDeposit(path: string): Promise<StorageDeposit | null>;

  getRealmEvents(params: GetRealmEventsRequest): Promise<GetRealmEventsResponse>;

  getRealmTransactions(params: GetRealmTransactionsRequest): Promise<GetRealmTransactionsResponse>;

  getRealmTokenTransfers(params: GetRealmTransactionsRequest): Promise<GetRealmTokenTransfersResponse>;

  getRealmInternalNativeTransfers(params: GetRealmTransactionsRequest): Promise<GetRealmTokenTransfersResponse>;
}
