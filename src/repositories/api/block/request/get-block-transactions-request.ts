export interface GetBlockTransactionsRequest {
  blockHeight: string;

  cursor?: string;

  limit?: number;
}
