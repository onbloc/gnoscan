export interface GetRealmsRequestParameters {
  cursor?: string;

  limit?: number; // @default 20

  sort?: "name" | "totalCallCount" | "storageDeposit" | "totalGasUsed";

  order?: "asc" | "desc";
}
