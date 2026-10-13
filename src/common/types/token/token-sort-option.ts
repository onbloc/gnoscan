export type TokenListSortField = "none" | "holders" | "marketCap" | "totalSupply";
export type TokenListSortOrder = "none" | "asc" | "desc";

export interface TokenListSortOption {
  field: TokenListSortField;
  order: TokenListSortOrder;
}
