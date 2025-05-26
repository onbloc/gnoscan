import { Amount } from "@/types/data-type";

export interface BaseTransactionModel {
  txHash: string;
  blockHeight: number;
  timestamp: string;

  successYn: boolean;
  messageCount: number;

  fromAddress: string;
  toAddress: string;

  fee: Amount;

  func: {
    messageType: string;
    funcType: string;
    pkgPath: string;
  }[];
}

export interface TransactionModel extends BaseTransactionModel {
  fromName: string;
  toName: string;

  amount: Amount;
}
