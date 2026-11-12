export interface GetTokensRequestParameters {
  /** Filters GRC20 tokens to the realm package that hosts them. */
  packagePath?: string;

  page?: number;

  limit?: number; // @default 20

  /**
   * `id` orders by row id, newest last. `createdAt` orders by creation block time: backfilled tokens get later ids.
   * `totalSupply` and `marketCap` order by the supply in whole tokens (and times price); unpriced tokens come last.
   */
  sort?: "holders" | "id" | "createdAt" | "totalSupply" | "marketCap" | "transfers24h";

  order?: "asc" | "desc";

  /** Matches name, symbol or package path. */
  keyword?: string;
}
