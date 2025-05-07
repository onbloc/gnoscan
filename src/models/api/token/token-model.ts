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
  amount: Amount;
  block: number;
  fee: Amount;
  from: string;
  func: {
    funcType: string;
    messageType: string;
    pkgPath: string;
  }[];
  timestamp: string;
  txHash: string;
}
