import { NetworkClient } from "@/common/clients/network-client";
import { ApiBlockRepository } from "./api-block-repository";

import { GetBlocksRequestParameters } from "./request";
import { GetBlocksResponse, GetBlockResponse } from "./response";
import { makeQueryParameter } from "@/common/utils/string-util";
import { CommonError } from "@/common/errors/common/common-error";

interface APIResponse<T> {
  data: T;
}

export class ApiBlockRepositoryImpl implements ApiBlockRepository {
  private networkClient: NetworkClient | null;
  constructor(networkClient: NetworkClient | null) {
    this.networkClient = networkClient;
  }

  getBlocks(params: GetBlocksRequestParameters): Promise<GetBlocksResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    const requestParams = makeQueryParameter({ ...params });

    return this.networkClient
      .get<APIResponse<GetBlocksResponse>>({
        url: `/blocks${requestParams}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getBlock(height: string) {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<GetBlockResponse>>({
        url: `blocks/${height}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }
}
