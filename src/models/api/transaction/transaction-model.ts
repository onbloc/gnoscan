export interface TransactionModel {
  amount: string;

  blockHeight: number;

  fee: string;

  from: string;

  func: [
    {
      funcType: string;
      messageType: string;
      pkgPath: string;
    },
  ];

  numOfMessage: number;

  success: boolean;

  timestamp: string;

  to: string;

  txHash: string;
}
