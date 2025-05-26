import { Amount } from "@/types/data-type";

export interface TransactionModel {
  txHash: string;
  blockHeight: number;
  timestamp: string;

  successYn: boolean;
  messageCount: number;

  fromAddress: string;
  fromName: string;
  toAddress: string;
  toName: string;

  amount: Amount;
  fee: Amount;

  func: {
    messageType: string;
    funcType: string;
    pkgPath: string;
  }[];
}
