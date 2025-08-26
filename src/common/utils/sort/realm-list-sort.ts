import { RealmListSortOption } from "@/common/types/realm";
import { Realm } from "@/types/data-type";
import { AmountUtils } from "../amount.utility";

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

      case "storageDeposit":
        const aStorageDeposit = AmountUtils.subtract(a.totalStorageDeposit, a.totalUnlockDeposit);
        const bStorageDeposit = AmountUtils.subtract(b.totalStorageDeposit, b.totalUnlockDeposit);
        return sortOption.order === "desc"
          ? Number(bStorageDeposit.value || 0) - Number(aStorageDeposit.value || 0)
          : Number(aStorageDeposit.value || 0) - Number(bStorageDeposit.value || 0);

      default:
        return 0;
    }
  });
};
