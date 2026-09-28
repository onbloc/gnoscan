import React from "react";

import { RealmMapper } from "@/common/mapper/realm/realm-mapper";
import {
  useGetRealmEventsByPath,
  useGetRealmDirectTransactionsByPath,
  useGetRealmNativeTransfersByPath,
  useGetRealmTokenTransfersByPath,
  useGetRealmInternalTransactionsByPath,
} from "@/common/react-query/realm/api";
import { debounce } from "@/common/utils/string-util";
import { useHistoryEntryState } from "@/common/hooks/detail-tabs/use-history-entry-state";
import { isOnlyStorageEventsHidden } from "@/common/utils/activity.utility";

import DataListSection from "../../details-data-section/data-list-section";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";
import { StandardNetworkEventDatatable } from "../../datatable/event/StandardNetworkEventDatatable";
import { ActivityEventsFilterBar, StorageHiddenNotice } from "../../datatable/event/ActivityEventsFilterBar";
import { ActivityDatatable } from "../../datatable/activity";
import { REALM_DETAIL_TABS, ACTIVITY_TAB } from "@/common/values/activity-tab.constant";

interface RealmInfoProps {
  path: string;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const StandardNetworkRealmInfo = ({ path, currentTab, setCurrentTab }: RealmInfoProps) => {
  const {
    data: directData,
    isFetched: isFetchedDirect,
    hasNextPage: hasNextPageDirect,
    fetchNextPage: fetchNextPageDirect,
  } = useGetRealmDirectTransactionsByPath({ path });
  const {
    data: nativeData,
    isFetched: isFetchedNative,
    hasNextPage: hasNextPageNative,
    fetchNextPage: fetchNextPageNative,
  } = useGetRealmNativeTransfersByPath({ path });
  const {
    data: tokenData,
    isFetched: isFetchedToken,
    hasNextPage: hasNextPageToken,
    fetchNextPage: fetchNextPageToken,
  } = useGetRealmTokenTransfersByPath({ path });
  const {
    data: internalData,
    isFetched: isFetchedInternal,
    hasNextPage: hasNextPageInternal,
    fetchNextPage: fetchNextPageInternal,
  } = useGetRealmInternalTransactionsByPath({ path });

  // Events filters are restored with the history entry, so back/forward keeps the loaded list.
  const [eventTypeInput, setEventTypeInput] = useHistoryEntryState(`realm:${path}:eventTypeInput`, "");
  const [eventType, setEventType] = useHistoryEntryState(`realm:${path}:eventType`, "");
  const [includeStorage, setIncludeStorage] = useHistoryEntryState(`realm:${path}:includeStorage`, false);
  const debouncedSetEventType = React.useMemo(() => debounce(setEventType, 300), [setEventType]);

  const handleEventTypeChange = (value: string) => {
    setEventTypeInput(value);
    debouncedSetEventType(value);
  };

  const {
    data: eventData,
    isFetched: isFetchedEventData,
    hasNextPage: hasNextPageEventData,
    fetchNextPage: fetchNextPageEventData,
  } = useGetRealmEventsByPath({ path, eventType: eventType || undefined, includeStorage });
  // Tab badge counts every realm event, independent of the list filters.
  const { data: eventCountData } = useGetRealmEventsByPath({ path, includeStorage: true, limit: 1 });

  const directTransactions = React.useMemo(() => directData?.pages.flatMap(page => page.items) ?? [], [directData]);
  const nativeTransfers = React.useMemo(() => nativeData?.pages.flatMap(page => page.items) ?? [], [nativeData]);
  const tokenTransfers = React.useMemo(() => tokenData?.pages.flatMap(page => page.items) ?? [], [tokenData]);
  const internalTransactions = React.useMemo(
    () => internalData?.pages.flatMap(page => page.items) ?? [],
    [internalData],
  );

  const realmEvents = React.useMemo(() => {
    if (!eventData?.pages) return [];

    const allItems = eventData.pages.flatMap(page => page.items);
    return RealmMapper.realmEventFromApiResponses(allItems);
  }, [eventData?.pages]);

  const totalEventCount = eventCountData?.pages[0]?.page.totalCount;
  const onlyStorageEventsHidden = isOnlyStorageEventsHidden({
    isFetched: isFetchedEventData,
    totalEventCount,
    visibleEventCount: realmEvents.length,
    eventType,
    includeStorage,
  });

  const detailTabs = React.useMemo(
    () => [
      { tabName: REALM_DETAIL_TABS[0], size: directData?.pages[0]?.page.totalCount },
      { tabName: REALM_DETAIL_TABS[1], size: nativeData?.pages[0]?.page.totalCount },
      { tabName: REALM_DETAIL_TABS[2], size: tokenData?.pages[0]?.page.totalCount },
      { tabName: REALM_DETAIL_TABS[3], size: internalData?.pages[0]?.page.totalCount },
      { tabName: REALM_DETAIL_TABS[4], size: totalEventCount },
    ],
    [directData, nativeData, tokenData, internalData, totalEventCount],
  );

  if (!isFetchedDirect) return <TableSkeleton />;

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === ACTIVITY_TAB.TRANSACTIONS && (
        <ActivityDatatable
          variant="direct"
          data={directTransactions}
          isFetched={isFetchedDirect}
          hasNextPage={hasNextPageDirect}
          nextPage={fetchNextPageDirect}
          moreLabel="View More Transactions"
        />
      )}
      {currentTab === ACTIVITY_TAB.NATIVE_TRANSFERS && (
        <ActivityDatatable
          variant="transfers"
          data={nativeTransfers}
          isFetched={isFetchedNative}
          hasNextPage={hasNextPageNative}
          nextPage={fetchNextPageNative}
          moreLabel="View More Transfers"
        />
      )}
      {currentTab === ACTIVITY_TAB.TOKEN_TRANSFERS && (
        <ActivityDatatable
          variant="transfers"
          data={tokenTransfers}
          isFetched={isFetchedToken}
          hasNextPage={hasNextPageToken}
          nextPage={fetchNextPageToken}
          moreLabel="View More Transfers"
        />
      )}
      {currentTab === ACTIVITY_TAB.INTERNAL_TRANSACTIONS && (
        <ActivityDatatable
          variant="internal"
          data={internalTransactions}
          isFetched={isFetchedInternal}
          hasNextPage={hasNextPageInternal}
          nextPage={fetchNextPageInternal}
          moreLabel="View More Transactions"
        />
      )}
      {currentTab === ACTIVITY_TAB.EVENTS && (
        <>
          <ActivityEventsFilterBar
            eventType={eventTypeInput}
            onEventTypeChange={handleEventTypeChange}
            includeStorage={includeStorage}
            onIncludeStorageChange={setIncludeStorage}
          />
          {onlyStorageEventsHidden && <StorageHiddenNotice onShowStorage={() => setIncludeStorage(true)} />}
          <StandardNetworkEventDatatable
            variant="activity"
            isFetched={isFetchedEventData}
            events={realmEvents}
            hasNextPage={hasNextPageEventData}
            nextPage={fetchNextPageEventData}
          />
        </>
      )}
    </DataListSection>
  );
};

export default StandardNetworkRealmInfo;
