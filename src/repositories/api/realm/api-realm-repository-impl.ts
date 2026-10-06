import { NetworkClient } from "@/common/clients/network-client";
import { NodeRPCClient } from "@/common/clients/node-client";
import { ApiRealmRepository } from "./api-realm-repository";

import {
  GetRealmsRequestParameters,
  GetRealmEventsRequest,
  GetRealmDirectTransactionsRequest,
  GetRealmNativeTransfersRequest,
  GetRealmTokenTransfersRequest,
  GetRealmInternalTransactionsRequest,
} from "./request";
import {
  GetRealmEventsResponse,
  GetRealmResponse,
  GetRealmsResponse,
  GetRealmDirectTransactionsResponse,
  GetRealmNativeTransfersResponse,
  GetRealmTokenTransfersResponse,
  GetRealmInternalTransactionsResponse,
} from "./response";
import { StorageDeposit } from "@/models/storage-deposit-model";
import { makeEncodedQueryParameter } from "@/common/utils/string-util";
import { hasStorageDepositProperties, convertToStorageDeposit } from "@/common/utils/storage-deposit-util";
import { CommonError } from "@/common/errors";
import { parseABCIKeyValueResponse } from "@/common/clients/node-client/utility";
import { ApiRepository } from "../api-repository";

export class ApiRealmRepositoryImpl extends ApiRepository implements ApiRealmRepository {
  private nodeClient: NodeRPCClient | null;
  constructor(networkClient: NetworkClient | null, nodeClient: NodeRPCClient | null) {
    super(networkClient);
    this.nodeClient = nodeClient;
  }

  getRealms(params: GetRealmsRequestParameters): Promise<GetRealmsResponse> {
    return this.get<GetRealmsResponse>("/realms", { ...params });
  }

  getRealm(path: string): Promise<GetRealmResponse> {
    return this.get<GetRealmResponse>(`/realms/${encodeURIComponent(path)}`);
  }

  getRealmEvents(params: GetRealmEventsRequest): Promise<GetRealmEventsResponse> {
    const { path, ...queryParams } = params;
    const requestParams = makeEncodedQueryParameter({ ...queryParams });
    return this.get<GetRealmEventsResponse>(`/realms/${encodeURIComponent(path)}/events${requestParams}`);
  }

  getRealmDirectTransactions(params: GetRealmDirectTransactionsRequest): Promise<GetRealmDirectTransactionsResponse> {
    const { path, ...queryParams } = params;
    return this.get<GetRealmDirectTransactionsResponse>(
      `/realms/${encodeURIComponent(path)}/direct-transactions`,
      queryParams,
    );
  }

  getRealmNativeTransfers(params: GetRealmNativeTransfersRequest): Promise<GetRealmNativeTransfersResponse> {
    const { path, ...queryParams } = params;
    return this.get<GetRealmNativeTransfersResponse>(
      `/realms/${encodeURIComponent(path)}/native-transfers`,
      queryParams,
    );
  }

  getRealmTokenTransfers(params: GetRealmTokenTransfersRequest): Promise<GetRealmTokenTransfersResponse> {
    const { path, ...queryParams } = params;
    return this.get<GetRealmTokenTransfersResponse>(`/realms/${encodeURIComponent(path)}/token-transfers`, queryParams);
  }

  getRealmInternalTransactions(
    params: GetRealmInternalTransactionsRequest,
  ): Promise<GetRealmInternalTransactionsResponse> {
    const { path, ...queryParams } = params;
    return this.get<GetRealmInternalTransactionsResponse>(
      `/realms/${encodeURIComponent(path)}/internal-transactions`,
      queryParams,
    );
  }

  async getRealmStorageDeposit(realmPath: string): Promise<StorageDeposit | null> {
    if (!this.nodeClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NodeRPCClient");
    }

    const response = await this.nodeClient.abciQueryVMStorageDeposit(realmPath).catch(() => null);
    if (!response || !response?.response?.ResponseBase?.Data) {
      return null;
    }

    try {
      const rawResult = parseABCIKeyValueResponse(response.response.ResponseBase.Data);

      if (hasStorageDepositProperties(rawResult)) {
        return convertToStorageDeposit(rawResult);
      }

      return null;
    } catch (e) {
      console.error("GetRealmStorageDeposit Error: ", e);
      return null;
    }
  }
}
