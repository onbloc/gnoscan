import { ValidatorStatus } from "@/models/api/validator/validator-model";

export interface GetValidatorByAddressResponse {
  address: string;

  operationAddress: string | null;

  name: string | null;

  status: ValidatorStatus;

  proposalId: string | null;

  registeredAt: string;
}
