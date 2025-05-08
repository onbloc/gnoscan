export interface GetAccountTransactionsRequest {
  address: string;

  cursor?: string;

  limit?: number;
}
