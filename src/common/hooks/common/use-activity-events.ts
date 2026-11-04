import React from "react";
import { UseQueryOptions, UseQueryResult } from "react-query";

import { usePagedList } from "@/common/hooks/common/use-paged-list";
import { useHistoryEntryState } from "@/common/hooks/detail-tabs/use-history-entry-state";
import { RealmMapper } from "@/common/mapper/realm/realm-mapper";
import { debounce } from "@/common/utils/string-util";
import { RealmEventModel } from "@/models/api/realm/realm-model";

interface EventsParams {
  path: string;
  limit?: number;
  eventType?: string;
  includeStorage?: boolean;
}

interface EventsResponse {
  items: RealmEventModel[];
  page: { hasNext: boolean; totalCount: number };
}

type EventsQuery<TParams> = (
  params: TParams,
  options?: UseQueryOptions<EventsResponse, Error, EventsResponse>,
) => UseQueryResult<EventsResponse, Error>;

/**
 * The Events tab of a realm, token or NFT collection: its filters, page, rows and `ListPagination` props.
 * `name` and `id` key the state kept per history entry, so back/forward keeps the filters and the page.
 * A different target or filter starts again from page 1.
 */
export const useActivityEvents = <TParams extends EventsParams & { page?: number }>(
  name: string,
  id: string,
  useQuery: EventsQuery<TParams>,
  options?: UseQueryOptions<EventsResponse, Error, EventsResponse>,
) => {
  const [eventTypeInput, setEventTypeInput] = useHistoryEntryState(`${name}:${id}:eventTypeInput`, "");
  const [eventType, setEventType] = useHistoryEntryState(`${name}:${id}:eventType`, "");
  const [includeStorage, setIncludeStorage] = useHistoryEntryState(`${name}:${id}:includeStorage`, false);
  const debouncedSetEventType = React.useMemo(() => debounce(setEventType, 300), [setEventType]);

  const list = usePagedList(
    `${name}-events`,
    `${id}:${eventType}:${includeStorage}`,
    useQuery,
    { path: id, eventType: eventType || undefined, includeStorage } as Omit<TParams, "page">,
    options,
  );

  // Tab badge counts every event, independent of the list filters.
  const { data: allEvents } = useQuery({ path: id, includeStorage: true, page: 1, limit: 1 } as TParams, options);

  const events = React.useMemo(() => RealmMapper.realmEventFromApiResponses(list.items), [list.items]);

  return {
    events,
    isFetched: list.isFetched,
    pagination: list.pagination,
    allCount: allEvents?.page.totalCount,
    filterBar: {
      eventType: eventTypeInput,
      onEventTypeChange: (value: string) => {
        setEventTypeInput(value);
        debouncedSetEventType(value.trim());
      },
      includeStorage,
      onIncludeStorageChange: setIncludeStorage,
    },
  };
};
