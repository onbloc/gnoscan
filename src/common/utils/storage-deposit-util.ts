import { StorageDeposit } from "@/models/storage-deposit-model";

interface StorageDepositResponse {
  storage: unknown;
  deposit: unknown;
  [key: string]: unknown;
}

/**
 * Type guard to validate if the given object has the required StorageDeposit properties
 * @param response Unknown object to validate
 * @returns boolean indicating if it has the required properties
 */
export const hasStorageDepositProperties = (response: unknown): response is StorageDepositResponse => {
  return (
    response !== null &&
    response !== undefined &&
    typeof response === "object" &&
    !Array.isArray(response) &&
    "storage" in response &&
    "deposit" in response
  );
};

/**
 * Converts and validates a raw response into a StorageDeposit object
 * @param response Object with storage and deposit properties (possibly as strings)
 * @returns StorageDeposit object with numeric values or null if invalid
 */
export const convertToStorageDeposit = (response: Record<string, unknown>): StorageDeposit | null => {
  const storage = typeof response.storage === "number" ? response.storage : parseInt(String(response.storage), 10);
  const deposit = typeof response.deposit === "number" ? response.deposit : parseInt(String(response.deposit), 10);

  if (isNaN(storage) || isNaN(deposit)) {
    return null;
  }

  return { storage, deposit };
};
