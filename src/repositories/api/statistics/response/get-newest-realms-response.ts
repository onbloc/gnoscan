import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";

export interface NewestRealmModel {
  block: number;
  calls: number;
  functions: number;
  path: string;
  publisher: string;
  publisherName: string;
  publisherLabel?: string | null;
  publisherLabelType?: ADDRESS_LABEL_TYPE | null;
  /** RFC3339 deploy time. */
  publishedAt?: string;
}

export interface GetNewestRealmsResponse {
  items: NewestRealmModel[];
  lastUpdated: string;
}
