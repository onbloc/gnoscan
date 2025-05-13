export interface GetTotalGasShareResponse {
  data: {
    range: string;
    series: {
      data: {
        date: string;
        gasUsed: string;
      }[];
      realm: string;
    }[];
  };
}

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
export interface GetTotalFeeShareResponse {
  items: TotalFeeShareData[];

  lastUpdated: string;
}
