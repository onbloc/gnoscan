import { NetworkClient } from "@/common/clients/network-client";
import { ApiRealmRepository } from "./api-realm-repository";

import { GetRealmsRequestParameters } from "./request";
import { GetRealmEventsResponse, GetRealmResponse, GetRealmsResponse, GetRealmTransactionsResponse } from "./response";
import { makeQueryParameter } from "@/common/utils/string-util";
import { CommonError } from "@/common/errors";

interface APIResponse<T> {
  data: T;
}

export class ApiRealmRepositoryImpl implements ApiRealmRepository {
  private networkClient: NetworkClient | null;
  constructor(networkClient: NetworkClient | null) {
    this.networkClient = networkClient;
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
        url: `/realms/${path}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getRealmEvents(path: string): Promise<GetRealmEventsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<GetRealmEventsResponse>>({
        url: `/realms/${path}/events`,
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getRealmTransactions(path: string): Promise<GetRealmTransactionsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<GetRealmTransactionsResponse>>({
        url: `/realms/${path}/transactions`,
      })
      .then(result => {
        return result.data?.data;
      });
  }
}
