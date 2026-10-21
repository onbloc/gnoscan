export interface GetTokensRequestParameters {
  /** Filters GRC20 tokens to the realm package that hosts them. */
  packagePath?: string;

  cursor?: string;

  limit?: number; // @default 20

  sort?: "holders";

  order?: "asc" | "desc";
}
