import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";

export interface RealmHolderModel {
  address: string;
  nameTag?: string;
  label?: string | null;
  labelType?: ADDRESS_LABEL_TYPE | null;
  tokenCount: number;
  percentage: number;
}

export interface GetRealmHoldersResponse {
  items: RealmHolderModel[];
  page: {
    cursor?: string;
    hasNext: boolean;
    totalCount?: number;
  };
}
