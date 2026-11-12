export interface GetTransactionEventsRequest {
  txHash: string;

  page?: number;

  limit?: number;
}
