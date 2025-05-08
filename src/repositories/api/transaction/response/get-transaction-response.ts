import { Amount } from "@/types/data-type";

export interface TransactionSummary {
  blockHeight: number;
  contractType: string;
  gas: {
    used: number;
    usedPercentage: string;
    wanted: number;
  };
  memo: string;
  network: string;
  success: true;
  timestamp: string;
  transactionFee: Amount;
  txHash: string;
  errorLog: string;
}

export interface GetTransactionResponse {
  // ToDo: Delete data layer
  data: TransactionSummary;
}
