export interface GetBlockEventsRequest {
  blockHeight: string;

  cursor?: string;

  limit?: number;
}
