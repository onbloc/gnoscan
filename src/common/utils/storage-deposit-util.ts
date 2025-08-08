import { StorageDeposit } from "@/models/storage-deposit-model";

/**
 * Type guard to validate if the given object is a valid StorageDeposit
 * @param response Unknown object to validate
 * @returns boolean indicating if it's a valid StorageDeposit
 */
export const isValidStorageDepositData = (response: unknown): response is StorageDeposit => {
  return (
    response !== null &&
    response !== undefined &&
    typeof response === "object" &&
    "storage" in response &&
    "deposit" in response &&
    typeof (response as StorageDeposit).storage === "number" &&
    typeof (response as StorageDeposit).deposit === "number"
  );
};
