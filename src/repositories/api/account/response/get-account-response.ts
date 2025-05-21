export interface AccountAssetModel {
  address: string;
  tokenType: "Native" | "GRC20";
  packagePath: string;
  amount: string;
  name: string;
  symbol: string;
  decimals: number;
  logoUrl: string;
}

export interface GetAccountResponse {
  data: {
    address: string;
    name: string;
    assets: AccountAssetModel[];
  };
}
