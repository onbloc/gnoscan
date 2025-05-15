import { EventModel } from "@/models/api/event/event-model";

export interface GetBlockEventsResponse {
  items: EventModel[];

  page: {
    cursor: string;
    hasNext: boolean;
  };
}
