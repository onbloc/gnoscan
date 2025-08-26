import { Amount } from "@/types";

export interface GetStorageDepositResponse {
  data: {
    storageDepositAmount: Amount;
    storagePricePerByte: string;
    storageUsage: string;
  };
}
