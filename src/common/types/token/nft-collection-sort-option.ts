export type NftCollectionListSortField = "none" | "id" | "holders" | "transfers" | "totalSupply";
export type NftCollectionListSortOrder = "none" | "asc" | "desc";

export interface NftCollectionListSortOption {
  field: NftCollectionListSortField;
  order: NftCollectionListSortOrder;
}
