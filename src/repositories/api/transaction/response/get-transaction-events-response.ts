import { EventModel } from "@/models/api/event/event-model";

export interface GetTransactionEventsResponse {
  items: EventModel[];

  page: { hasNext: boolean; cursor: string };
}
