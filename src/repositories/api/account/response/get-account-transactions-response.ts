import { Amount } from "@/types/data-type";

export interface AccountTransactionInfo {
  amountIn: Amount;
  amountOut: Amount;
  blockHeight: number;
  fee: Amount;
  func: {
    funcType: string;
    messageType: string;
    pkgPath: string;
  }[];
  successYn: boolean;
  timestamp: string;
  token: string;
  txHash: string;
}

export interface GetAccountTransactionsResponse {
  items: AccountTransactionInfo[];

  page: {
    cursor: string;
    hasNext: boolean;
  };
}
