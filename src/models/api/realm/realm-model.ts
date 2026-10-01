import { Amount } from "@/types/data-type";
import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";

export interface RealmModel {
  txHash: string;
  index: number;
  success: boolean;
  name: string;
  path: string;
  funcCount: number;
  blockHeight: number;
  publisher: string;
  publisherName: string;
  publisherLabel?: string | null;
  publisherLabelType?: ADDRESS_LABEL_TYPE | null;
  totalCallCountSuccess: number;
  totalCallCountFailed: number;
  totalCallCount: number;
  totalGasUsed: Amount;
  storageUsage: Amount;
  totalReleaseStorageUsage: number;
  totalStorageUsage: number;
  totalStorageDeposit: Amount;
  totalUnlockDeposit: Amount;
}

export interface RealmSummaryModel {
  balance: Amount;
  blockPublished: number;
  contractCallCount: number;
  func: [
    {
      typesList: string;
      typesListUrl: string;
    },
  ];
  name: string;
  path: string;
  isEnableYn?: "Y" | "N" | string;
  publisher: string;
  publisherName: string;
  publisherLabel?: string | null;
  publisherLabelType?: ADDRESS_LABEL_TYPE | null;
  realmAddress: string;
  sourceFiles: [
    {
      content: string;
      filename: string;
    },
  ];
  totalUsedFees: Amount;
}

export interface RealmEventModel {
  identifier: string;

  txHash: string;

  blockHeight: number;

  eventName: string;

  caller: string;

  callerName: string;

  callerLabel?: string | null;

  callerLabelType?: ADDRESS_LABEL_TYPE | null;

  originCaller: string;

  originCallerLabel?: string | null;

  originCallerLabelType?: ADDRESS_LABEL_TYPE | null;

  realmPath: string;

  function: string;

  emit: { name: string; params: { key: string; value: string }[] };

  timestamp: string;
}
