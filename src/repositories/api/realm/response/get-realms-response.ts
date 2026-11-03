import { RealmModel } from "@/models/api/realm/realm-model";

export interface GetRealmsResponse {
  items: RealmModel[];

  page: {
    hasNext: boolean;
    totalCount: number;
  };
}
