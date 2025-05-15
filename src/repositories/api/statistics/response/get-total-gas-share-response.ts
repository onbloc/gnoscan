export interface PackageInfo {
  packagePath: string;
  gasShared: number;
}

export interface DailyPackages {
  [packageName: string]: PackageInfo;
}

export interface TotalFeeShareData {
  [date: string]: DailyPackages;
}

export type GetTotalFeeShareResponse = TotalFeeShareData;
