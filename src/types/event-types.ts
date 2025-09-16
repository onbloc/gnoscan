export const EVENT_TYPES = {
  GNO_EVENT: "/tm.GnoEvent",
  STORAGE_DEPOSIT_EVENT: "/tm.StorageDepositEvent",
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

export interface GnoEventData {
  "@type": "/tm.GnoEvent";
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
