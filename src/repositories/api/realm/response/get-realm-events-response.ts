import { RealmEventModel } from "@/models/api/realm/realm-model";

export interface GetRealmEventsResponse {
  items: RealmEventModel[];

  page: { hasNext: boolean; cursor: string };
}
