import { RealmListSortField, RealmListSortOption } from "@/common/types/realm";
import { GetRealmsRequestParameters } from "@/repositories/api/realm/request";

type RealmListApiSort = NonNullable<GetRealmsRequestParameters["sort"]>;

// Maps a sortable table column (header key) to the API `sort` value so sorting
// runs server-side over the full realm set instead of the loaded page only.
const FIELD_TO_API_SORT: Record<Exclude<RealmListSortField, "none">, RealmListApiSort> = {
  packageName: "name",
  blockHeight: "blockHeight",
  totalCalls: "totalCallCount",
  storageDeposit: "storageDeposit",
  totalGasUsed: "totalGasUsed",
};

// Translates the UI sort option into API request params. Returns no sort/order
// when unsorted so the server falls back to its default (newest first).
export const toRealmListApiSortParams = (
  sortOption: RealmListSortOption,
): Pick<GetRealmsRequestParameters, "sort" | "order"> => {
  if (sortOption.field === "none" || sortOption.order === "none") {
    return {};
  }

  return {
    sort: FIELD_TO_API_SORT[sortOption.field],
    order: sortOption.order,
  };
};
