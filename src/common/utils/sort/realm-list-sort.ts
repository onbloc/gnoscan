import { RealmListSortOption } from "@/common/types/realm";
import { Realm } from "@/types/data-type";

export const sortRealmList = (items: Realm[] = [], sortOption: RealmListSortOption) => {
  if (!items.length || sortOption.field === "none" || sortOption.order === "none") {
    return items;
  }

  return [...items].sort((a, b) => {
    switch (sortOption.field) {
      case "packageName":
        const nameComparison = a.packageName.localeCompare(b.packageName);
        return sortOption.order === "desc" ? -nameComparison : nameComparison;

      case "totalCalls":
        const aCount = Number(a?.totalCalls || 0);
        const bCount = Number(b?.totalCalls || 0);
        return sortOption.order === "desc" ? bCount - aCount : aCount - bCount;

      default:
        return 0;
    }
  });
};
