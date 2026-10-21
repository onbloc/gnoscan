import { RealmEventModel } from "@/models/api/realm/realm-model";

// Token events retain the same shape as realm events (contract: "token events same").
export interface GetTokenEventsResponse {
  items: RealmEventModel[];

  page: { hasNext: boolean; cursor: string; totalCount?: number };
}
