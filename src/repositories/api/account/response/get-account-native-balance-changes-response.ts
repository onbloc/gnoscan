import { ActivityFunc, ActivityPage } from "@/models/api/activity/activity-model";

export type NativeBalanceChangeType = "TRANSFER" | "GAS_FEE" | "STORAGE_DEPOSIT" | "STORAGE_UNDEPOSIT" | "RECONCILE";

export interface AccountNativeBalanceChangePart {
  type: NativeBalanceChangeType;

  // Signed change in ugnot, as an integer string
  amount: string;
}

/**
 * A transaction that changed the balance, or the reconciliation of a block. A reconciliation is a row of its own,
 * as the processor cannot tell which transaction it was for: its txHash is null, it has a single RECONCILE change,
 * and it has no messages (messageCount 0, func empty).
 */
export interface AccountNativeBalanceChange {
  txHash: string | null;
  blockHeight: number;
  timestamp: string;
  successYn: boolean;

  // Net change of the transaction in ugnot, signed, as an integer string
  amount: string;

  // The share of each transfer type in the net change
  changes: AccountNativeBalanceChangePart[];

  // The messages of the transaction, as in the activity lists
  messageCount: number;
  func: ActivityFunc[];
}

export interface GetAccountNativeBalanceChangesResponse {
  address: string;
  denom: string;
  // Absent for the whole history
  from?: string;
  to: string;
  // Newest first
  items: AccountNativeBalanceChange[];
  page: ActivityPage;
}
