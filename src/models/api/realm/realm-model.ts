import { Amount } from "@/types/data-type";

export interface RealmModel {
  txHash: string;
  index: number;
  success: boolean;
  name: string;
  path: string;
  funcCount: number;
  blockHeight: number;
  publisher: string;
  totalCallCountSuccess: number;
  totalCallCountFailed: number;
  totalCallCount: number;
  totalGasUsed: Amount;
}

export interface RealmSummaryModel {
  balance: string;
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
  publisher: string;
  realmAddress: string;
  sourceFiles: [
    {
      content: string;
      filename: string;
    },
  ];
  totalUsedFees: Amount;
}

export interface RealmTransactionModel {
  txHash: string;
  func: [
    {
      funcType: string;
      messageType: string;
      pkgPath: string;
    },
  ];
  success: boolean;
  block: number;
  from: string;
  to: string;
  amount: Amount;
  fee: Amount;
  timestamp: string;
}

export interface RealmEventModel {
  identifier: string;

  txHash: string;

  blockHeight: number;

  eventName: string;

  caller: string;

  originCaller: string;

  realmPath: string;

  function: string;

  emit: { name: string; params: { key: string; value: string }[] };

  timestamp: string;
}
