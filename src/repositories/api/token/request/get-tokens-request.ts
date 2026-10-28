export interface GetTokensRequestParameters {
  /** Filters GRC20 tokens to the realm package that hosts them. */
  packagePath?: string;

  cursor?: string;

  limit?: number; // @default 20

  /** `id` orders by row id, newest last. `createdAt` orders by creation block time: backfilled tokens get later ids. */
  sort?: "holders" | "id" | "createdAt";

  order?: "asc" | "desc";

  /** Matches name, symbol or package path. */
  keyword?: string;
}
