export interface GetTokenEventsRequest {
  path: string;

  cursor?: string;

  limit?: number;

  eventType?: string;

  // Server-side default is false: StorageDeposit/StorageUnlock events stay hidden
  // unless the caller explicitly opts in.
  includeStorage?: boolean;
}
