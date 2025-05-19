export interface AccountAssetTokenInfo {
  address: string;
  tokenType: string;
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
    assets: AccountAssetTokenInfo[];
  };
}
