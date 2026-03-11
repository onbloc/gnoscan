import { GetValidatorsRequest, GetValidatorCommitsRequest } from "./request";
import { GetValidatorsResponse, GetValidatorCommitsResponse } from "./response";

export interface ApiValidatorRepository {
  getValidators(params: GetValidatorsRequest): Promise<GetValidatorsResponse>;

  getValidatorCommits(params: GetValidatorCommitsRequest): Promise<GetValidatorCommitsResponse>;
}
