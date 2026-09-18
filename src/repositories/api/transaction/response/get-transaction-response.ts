import { Amount, TransactionSummaryDetail } from "@/types/data-type";

export interface TransactionSummary {
  blockHeight: number;
  gas: {
    used: number;
    usedPercentage: string;
    wanted: number;
  };
  memo: string;
  network: string;
  success: boolean;
  timestamp: string;
  transactionFee: Amount;
  storageDeposit: Amount;
  storageUsage: number;
  txHash: string;
  txHashBase64: string;
  errorLog: string;
  hasApplicationError: boolean;
  txIndex: number;
  summary: TransactionSummaryDetail | null;
}

export interface GetTransactionResponse {
  // ToDo: Delete data layer
  data: TransactionSummary;
}
