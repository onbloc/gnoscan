import { Amount } from "@/types/data-type";
export interface BlockTransactionModel {
  amount: Amount;
  blockHeight: number;
  fee: Amount;
  from: string;
  fromName: string;
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
  toName: string;
  txHash: string;
}
