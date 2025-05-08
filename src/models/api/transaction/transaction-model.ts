import { Amount } from "@/types/data-type";

export interface TransactionModel {
  amount: Amount;

  blockHeight: number;

  fee: Amount;

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
