import { RealmModel } from "@/models/api/realm/realm-model";

export interface GetRealmsResponse {
  items: RealmModel[];

  page: {
    cursor: string;
    hasNext: boolean;
    nextCursor: string;
  };
}
