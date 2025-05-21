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

  success: boolean;

  block: number;

  from: string;

  to: string;

  amount: Amount;

  fee: Amount;

  timestamp: string;
}
