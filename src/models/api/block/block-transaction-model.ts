import { Amount } from "@/types/data-type";
export interface BlockTransactionModel {
  amount: Amount;
  blockHeight: number;
  fee: Amount;
  fromAddress: string;
  fromName: string;
  func: [
    {
      funcType: string;
      messageType: string;
      pkgPath: string;
    },
  ];
  messageCount: number;
  successYn: boolean;
  timestamp: string;
  toAddress: string;
  toName: string;
  txHash: string;
}
