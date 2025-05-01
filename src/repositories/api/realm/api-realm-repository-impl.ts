import { NetworkClient } from "@/common/clients/network-client";
import { ApiRealmRepository } from "./api-realm-repository";

import { GetRealmsRequestParameters } from "./request";
import { GetRealmsResponse } from "./response";
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
        url: `/blocks${requestParams}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }
}
