import { ValidatorCommitModel } from "@/models/api/validator/validator-model";

export interface GetValidatorCommitsResponse {
  validatorCommits: ValidatorCommitModel[];

  fromHeight: number;

  toHeight: number;
}
