import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";

export interface TokenHolderModel {
  address: string;
  nameTag: string | null;
  label?: string | null;
  labelType?: ADDRESS_LABEL_TYPE | null;
  balance: string;
  percentage: number;
}
