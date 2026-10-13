export type NftCollectionListSortField = "none" | "id" | "holders";
export type NftCollectionListSortOrder = "none" | "asc" | "desc";

export interface NftCollectionListSortOption {
  field: NftCollectionListSortField;
  order: NftCollectionListSortOrder;
}
