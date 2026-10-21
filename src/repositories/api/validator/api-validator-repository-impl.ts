import { ApiValidatorRepository } from "./api-validator-repository";
import { GetValidatorsRequest, GetValidatorCommitsRequest } from "./request";
import { GetValidatorsResponse, GetValidatorCommitsResponse, GetValidatorByAddressResponse } from "./response";
import { ApiRepository } from "../api-repository";

export class ApiValidatorRepositoryImpl extends ApiRepository implements ApiValidatorRepository {
  getValidators(params: GetValidatorsRequest): Promise<GetValidatorsResponse> {
    return this.get<GetValidatorsResponse>("/validators", { ...params });
  }

  getValidatorCommits(params: GetValidatorCommitsRequest): Promise<GetValidatorCommitsResponse> {
    return this.get<GetValidatorCommitsResponse>("/validators/commits", { ...params });
  }

  getValidatorByAddress(address: string): Promise<GetValidatorByAddressResponse> {
    return this.get<GetValidatorByAddressResponse>(`/validators/${address}`);
  }
}
