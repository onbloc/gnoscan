import { Amount } from "@/types/data-type";

export interface TokenModel {
  name: string;
  symbol: string;
  owner: string;
  holders: number;
  funcTypesList: string[];
  decimals: number;
  totalSupply: string;
  path: string;
  logoUrl: string | null;
}

export interface TokenTransactionModel {
  txHash: string;

  func: {
    messageType: string;
    funcType: string;
    pkgPath: string;
  }[];

  successYn: boolean;

  blockHeight: number;

  fromAddress: string;

  fromName: string;

  toAddress: string;

  toName: string;

  amount: Amount;

  fee: Amount;

  messageCount: number;

  timestamp: string;
}
