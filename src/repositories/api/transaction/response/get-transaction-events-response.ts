import { EventModel } from "@/models/api/event/event-model";

export interface GetTransactionEventsResponse {
  events: EventModel[];
}
