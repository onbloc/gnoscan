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
  totalUsedFees: string;
}

export interface RealmTransactionModel {
  amount: string;
  block: number;
  fee: string;
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
  totalUsedFees: string;
}
