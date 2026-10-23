export interface GetTokensRequestParameters {
  /** Filters GRC20 tokens to the realm package that hosts them. */
  packagePath?: string;

  cursor?: string;

  limit?: number; // @default 20

  /** `id` orders by registration, newest last. */
  sort?: "holders" | "id";

  order?: "asc" | "desc";

  /** Matches name, symbol or package path. */
  keyword?: string;
}
