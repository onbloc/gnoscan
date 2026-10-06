import { ADDRESS_LABEL_TAG, ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";

export interface TokenHolderModel {
  address: string;
  nameTag: string | null;
  label?: string | null;
  labelType?: ADDRESS_LABEL_TYPE | null;
  labelTag?: ADDRESS_LABEL_TAG | null;
  balance: string;
  percentage: number;
}
