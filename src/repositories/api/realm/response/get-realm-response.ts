import { RealmSummaryModel } from "@/models/api/realm/realm-model";

export interface GetRealmResponse {
  data: RealmSummaryModel;
  page: string;
}
