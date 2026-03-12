import { ValidatorModel } from "@/models/api/validator/validator-model";

export interface GetValidatorsResponse {
  items: ValidatorModel[];

  page: {
    hasNext: boolean;
  };
}
