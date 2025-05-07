import { Amount } from "@/types/data-type";

export interface RealmModel {
  blockHeight: number;
  funcCount: number;
  index: number;
  name: string;
  path: string;
  publisher: string;
  success: true;
  totalCallCount: number;
  totalGasUsed: string;
  txHash: string;
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
