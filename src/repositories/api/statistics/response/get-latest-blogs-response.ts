import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";

export interface GetLatestBlogsResponse {
  items: {
    id: number;
    publisher: string;
    publisherName: string;
    publisherLabel?: string | null;
    publisherLabelType?: ADDRESS_LABEL_TYPE | null;
    title: string;
    url: string;
  }[];
  lastUpdated: string;
}
