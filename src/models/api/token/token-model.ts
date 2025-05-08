import { Amount } from "@/types/data-type";

export interface TokenModel {
  path: string;
  owner: string;
  name: string;
  symbol: string;
  decimals: number;
  funcTypesList: string[];
  totalSupply: string;
  holders: number;
  logUrl: string;
}

export interface TokenTransactionModel {
  txHash: string;

  func: {
    messageType: string;
    funcType: string;
    pkgPath: string;
  }[];

  success: boolean;

  block: number;

  from: string;

  to: string;

  amount: Amount;

  fee: Amount;

  timestamp: string;
}
