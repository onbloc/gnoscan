import {
  GetRealmsRequestParameters,
  GetRealmEventsRequest,
  GetRealmDirectTransactionsRequest,
  GetRealmNativeTransfersRequest,
  GetRealmTokenTransfersRequest,
  GetRealmInternalTransactionsRequest,
  GetRealmHoldersRequest,
} from "./request";
import {
  GetRealmEventsResponse,
  GetRealmResponse,
  GetRealmsResponse,
  GetRealmDirectTransactionsResponse,
  GetRealmNativeTransfersResponse,
  GetRealmTokenTransfersResponse,
  GetRealmInternalTransactionsResponse,
  GetRealmHoldersResponse,
} from "./response";
import { StorageDeposit } from "@/models/storage-deposit-model";
export interface ApiRealmRepository {
  getRealms(params: GetRealmsRequestParameters): Promise<GetRealmsResponse>;

  getRealm(path: string): Promise<GetRealmResponse>;

  getRealmStorageDeposit(path: string): Promise<StorageDeposit | null>;

  getRealmEvents(params: GetRealmEventsRequest): Promise<GetRealmEventsResponse>;

  getRealmDirectTransactions(params: GetRealmDirectTransactionsRequest): Promise<GetRealmDirectTransactionsResponse>;

  getRealmNativeTransfers(params: GetRealmNativeTransfersRequest): Promise<GetRealmNativeTransfersResponse>;

  getRealmTokenTransfers(params: GetRealmTokenTransfersRequest): Promise<GetRealmTokenTransfersResponse>;

  getRealmInternalTransactions(
    params: GetRealmInternalTransactionsRequest,
  ): Promise<GetRealmInternalTransactionsResponse>;

  getRealmHolders(params: GetRealmHoldersRequest): Promise<GetRealmHoldersResponse>;
}
