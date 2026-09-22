export type RealmListSortField =
  | "none"
  | "packageName"
  | "blockHeight"
  | "totalCalls"
  | "storageDeposit"
  | "totalGasUsed";
export type RealmListSortOrder = "none" | "asc" | "desc";

export interface RealmListSortOption {
  field: RealmListSortField;
  order: RealmListSortOrder;
}
