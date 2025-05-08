export interface GetAccountEventsRequest {
  address: string;

  cursor?: string;

  limit?: number;
}
