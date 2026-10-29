export interface GetRealmsRequestParameters {
  cursor?: string;

  limit?: number; // @default 20

  sort?: "name" | "blockHeight" | "totalCallCount" | "storageDeposit" | "totalGasUsed";

  order?: "asc" | "desc";

  /** Matches realm name or package path. */
  keyword?: string;
}
