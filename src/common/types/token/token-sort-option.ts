export type TokenListSortField = "none" | "holders";
export type TokenListSortOrder = "none" | "asc" | "desc";

export interface TokenListSortOption {
  field: TokenListSortField;
  order: TokenListSortOrder;
}
