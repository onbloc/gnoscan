export type AssetsDataType = {
  denom: string;
  value: number | string;
  name: string;
};

export interface AccountDetailsModel {
  address: string;
  username: string;
  assets: AssetsDataType[];
}
