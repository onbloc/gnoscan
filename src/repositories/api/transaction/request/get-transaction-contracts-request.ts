export interface GetTransactionContractsRequest {
  txHash: string;

  cursor?: string;

  limit?: number;
}
