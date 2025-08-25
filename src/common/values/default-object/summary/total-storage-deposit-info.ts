import { TotalStorageDeposit } from "@/types";

import { GNOTToken } from "@/common/hooks/common/use-token-meta";

export const DEFAULT_TOTAL_STORAGE_DEPOSIT_INFO: TotalStorageDeposit = {
  storageDepositAmount: { denom: GNOTToken.denom, value: "0" },
  storagePricePerByte: "0",
  storageUsage: "0",
} as const;
