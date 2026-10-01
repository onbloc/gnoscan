import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";

export interface ActiveAccountModel {
  account: string;
  accountName: string;
  accountLabel?: string | null;
  accountLabelType?: ADDRESS_LABEL_TYPE | null;
  balance: string;
  nonTransferTxs: number;
  totalTxs: number;
}

export interface GetMonthlyActiveAccountsResponse {
  items: ActiveAccountModel[];

  lastUpdated: string;
}
