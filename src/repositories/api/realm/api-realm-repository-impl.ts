import { NetworkClient } from "@/common/clients/network-client";
import { NodeRPCClient } from "@/common/clients/node-client";
import { ApiRealmRepository } from "./api-realm-repository";

import { GetRealmsRequestParameters, GetRealmEventsRequest, GetRealmTransactionsRequest } from "./request";
import {
  GetRealmEventsResponse,
  GetRealmResponse,
  GetRealmsResponse,
  GetRealmTransactionsResponse,
  GetRealmStorageDepositResponse,
} from "./response";
import { makeQueryParameter } from "@/common/utils/string-util";
import { CommonError } from "@/common/errors";
import { parseABCIKeyValueResponse } from "@/common/clients/node-client/utility";
import { RealmStorageDeposit } from "@/models/realm-storage-deposit-model";

interface APIResponse<T> {
  data: T;
}

export class ApiRealmRepositoryImpl implements ApiRealmRepository {
  private networkClient: NetworkClient | null;
  private nodeClient: NodeRPCClient | null;
  constructor(networkClient: NetworkClient | null, nodeClient: NodeRPCClient | null) {
    this.networkClient = networkClient;
    this.nodeClient = nodeClient;
  }

  getRealms(params: GetRealmsRequestParameters): Promise<GetRealmsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    const requestParams = makeQueryParameter({ ...params });

    return this.networkClient
      .get<APIResponse<GetRealmsResponse>>({
        url: `/realms${requestParams}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getRealm(path: string): Promise<GetRealmResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<GetRealmResponse>>({
        url: `/realms/${encodeURIComponent(path)}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getRealmEvents(params: GetRealmEventsRequest): Promise<GetRealmEventsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    const { path, ...queryParams } = params;
    const requestParams = makeQueryParameter({ ...queryParams });

    return this.networkClient
      .get<APIResponse<GetRealmEventsResponse>>({
        url: `/realms/${encodeURIComponent(path)}/events${requestParams}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getRealmTransactions(params: GetRealmTransactionsRequest): Promise<GetRealmTransactionsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    const { path, ...queryParams } = params;
    const requestParams = makeQueryParameter({ ...queryParams });

    return this.networkClient
      .get<APIResponse<GetRealmTransactionsResponse>>({
        url: `/realms/${encodeURIComponent(path)}/transactions${requestParams}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }

  async getRealmStorageDeposit(realmPath: string): Promise<GetRealmStorageDepositResponse | null> {
    if (!this.nodeClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NodeRPCClient");
    }

    const response = await this.nodeClient.abciQueryVMStorageDeposit(realmPath).catch(() => null);
    if (!response || !response?.response?.ResponseBase?.Data) {
      return null;
    }

    try {
      const rawResult = parseABCIKeyValueResponse(response.response.ResponseBase.Data);

      if (this.isValidStorageDepositData(rawResult)) {
        return {
          storage: rawResult.storage,
          deposit: rawResult.deposit,
        };
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  private isValidStorageDepositData(response: unknown): response is RealmStorageDeposit {
    return (
      response !== null &&
      response !== undefined &&
      typeof response === "object" &&
      "storage" in response &&
      "deposit" in response &&
      typeof (response as RealmStorageDeposit).storage === "number" &&
      typeof (response as RealmStorageDeposit).deposit === "number"
    );
  }
}
