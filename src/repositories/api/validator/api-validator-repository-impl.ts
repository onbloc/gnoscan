import { NetworkClient } from "@/common/clients/network-client";
import { ApiValidatorRepository } from "./api-validator-repository";
import { GetValidatorsRequest, GetValidatorCommitsRequest } from "./request";
import { GetValidatorsResponse, GetValidatorCommitsResponse, GetValidatorByAddressResponse } from "./response";
import { makeQueryParameter } from "@/common/utils/string-util";
import { CommonError } from "@/common/errors/common/common-error";

interface APIResponse<T> {
  data: T;
}

export class ApiValidatorRepositoryImpl implements ApiValidatorRepository {
  private networkClient: NetworkClient | null;

  constructor(networkClient: NetworkClient | null) {
    this.networkClient = networkClient;
  }

  getValidators(params: GetValidatorsRequest): Promise<GetValidatorsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    const requestParams = makeQueryParameter({ ...params });

    return this.networkClient
      .get<APIResponse<GetValidatorsResponse>>({
        url: `/validators${requestParams}`,
      })
      .then(result => result.data?.data);
  }

  getValidatorCommits(params: GetValidatorCommitsRequest): Promise<GetValidatorCommitsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    const requestParams = makeQueryParameter({ ...params });

    return this.networkClient
      .get<APIResponse<GetValidatorCommitsResponse>>({
        url: `/validators/commits${requestParams}`,
      })
      .then(result => result.data?.data);
  }

  getValidatorByAddress(address: string): Promise<GetValidatorByAddressResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<GetValidatorByAddressResponse>>({
        url: `/validators/${address}`,
      })
      .then(result => result.data?.data);
  }
}
