export type AssetsDataType = {
  type: string;
  denom: string;
  value: number | string;
  name: string;
  pkg_path?: string;
  image?: string;
};

export interface AccountDetailsModel {
  address: string;
  username: string;
  assets: AssetsDataType[];
}
