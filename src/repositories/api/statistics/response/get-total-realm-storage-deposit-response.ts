export interface StorageDepositInfo {
  packagePath: string;
  storageDepositAmount: number;
  storageUsage: number;
}

export interface DailyStorageDepositPackages {
  [packageName: string]: StorageDepositInfo;
}

export interface TotalRealmStorageDepositData {
  [date: string]: DailyStorageDepositPackages;
}

export type GetTotalRealmStorageDepositResponse = TotalRealmStorageDepositData;
