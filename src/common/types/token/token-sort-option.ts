export type TokenListSortField = "none" | "holders" | "marketCap" | "totalSupply" | "transfers24h";
export type TokenListSortOrder = "none" | "asc" | "desc";

export interface TokenListSortOption {
  field: TokenListSortField;
  order: TokenListSortOrder;
}
