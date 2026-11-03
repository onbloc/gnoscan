export interface GetTransactionsRequestParameters {
  page?: number;

  /** Pins the list to a block height, from `page.snapshotHeight` of an earlier response (default: latest). */
  snapshotHeight?: number;

  limit?: number; // @default 20
}
