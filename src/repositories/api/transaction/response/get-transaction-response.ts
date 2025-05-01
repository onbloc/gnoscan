export interface GetTransactionResponse {
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
  transactionFee: string;
  txHash: string;
}
