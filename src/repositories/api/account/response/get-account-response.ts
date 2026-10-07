import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";

export interface AccountAssetModel {
  address: string;
  label?: string | null;
  labelType?: ADDRESS_LABEL_TYPE | null;
  tokenType: "Native" | "GRC20" | "GRC721";
  tokenId: string;
  slug: string;
  packagePath: string;
  amount: string;
  name: string;
  symbol: string;
  decimals: number;
  logoUrl: string;
}

/**
 * Native GNOT vesting values, expressed in raw ugnot units.
 *
 * The API omits this object when an account has no vesting grant (or the
 * chain RPC cannot be reached), so consumers must preserve the non-vesting
 * asset presentation as a fallback.
 */
export interface AccountVestingModel {
  startTime: string | null;
  type: "continuous" | "delayed";
  originalVesting: string;
  endTime: string;
  total: string;
  vested: string;
  locked: string;
  available: string;
  blockTime: string;
  updatedAt: string;
  progress: number;
  isStale: boolean;
}

export interface GetAccountResponse {
  data: {
    address: string;
    name: string;
    label?: string | null;
    labelType?: ADDRESS_LABEL_TYPE | null;
    assets: AccountAssetModel[];
    vesting?: AccountVestingModel;
  };
}
