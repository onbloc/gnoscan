import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";

export interface AccountAssetModel {
  address: string;
  label?: string | null;
  labelType?: ADDRESS_LABEL_TYPE | null;
  tokenType: "Native" | "GRC20";
  tokenId: string;
  slug: string;
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
    label?: string | null;
    labelType?: ADDRESS_LABEL_TYPE | null;
    assets: AccountAssetModel[];
  };
}
