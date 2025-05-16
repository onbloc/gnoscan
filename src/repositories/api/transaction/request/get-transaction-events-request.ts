export interface GetTransactionEventsRequest {
  txHash: string;

  cursor?: string;

  limit?: number;
}
