export interface GetAccountDirectTransactionsRequest {
  address: string;

  cursor?: string;

  limit?: number;
}
