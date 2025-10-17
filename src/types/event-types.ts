export const EVENT_TYPES = {
  GNO_EVENT: "/tm.Event",
  STORAGE_DEPOSIT_EVENT: "/tm.StorageDepositEvent",
  STORAGE_UNLOCK_EVENT: "/tm.StorageUnlockEvent",
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

export interface GnoEventData {
  "@type": "/tm.Event";
  type: string;
  attrs: Array<{ key: string; value: string }>;
  pkg_path: string;
  func: string;
}

export interface StorageDepositEventData {
  "@type": "/tm.StorageDepositEvent";
  bytes_delta: string;
  fee_delta: string;
  pkg_path: string;
}

export interface StorageUnlockEventData {
  "@type": "/tm.StorageDepositEvent";
  bytes_delta: string;
  fee_refund: string;
  refund_withheld: boolean;
  pkg_path: string;
}
