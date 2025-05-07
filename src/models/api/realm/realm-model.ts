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
  amount: Amount;
  block: number;
  fee: Amount;
  from: string;
  func: [
    {
      funcType: string;
      messageType: string;
      pkgPath: string;
    },
  ];
  timestamp: string;
  txHash: string;
}

export interface RealmEventModel {
  blockHeight: number;

  caller: string;

  emit: { name: string; params: { key: string; value: string }[] };

  eventName: string;

  function: string;

  identifier: string;

  originCaller: string;

  realmPath: string;

  timestamp: string;

  txHash: string;
}
