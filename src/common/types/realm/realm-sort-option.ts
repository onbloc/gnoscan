export type RealmListSortField = "none" | "packageName" | "totalCalls" | "storageDeposit";
export type RealmListSortOrder = "none" | "asc" | "desc";

export interface RealmListSortOption {
  field: RealmListSortField;
  order: RealmListSortOrder;
}
