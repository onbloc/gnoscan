export type RealmListSortField = "none" | "packageName" | "totalCalls";
export type RealmListSortOrder = "none" | "asc" | "desc";

export interface RealmListSortOption {
  field: RealmListSortField;
  order: RealmListSortOrder;
}
