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

import DataListSection from "../../details-data-section/data-list-section";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";
import { StandardNetworkEventDatatable } from "../../datatable/event/StandardNetworkEventDatatable";
import { ActivityEventsFilterBar } from "../../datatable/event/ActivityEventsFilterBar";
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

  const [eventTypeInput, setEventTypeInput] = React.useState("");
  const [eventType, setEventType] = React.useState("");
  const [includeStorage, setIncludeStorage] = React.useState(false);
  const debouncedSetEventType = React.useMemo(() => debounce(setEventType, 300), []);

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

  const detailTabs = React.useMemo(
    () => [
      { tabName: REALM_DETAIL_TABS[0], size: directData?.pages[0]?.page.totalCount },
      { tabName: REALM_DETAIL_TABS[1], size: nativeData?.pages[0]?.page.totalCount },
      { tabName: REALM_DETAIL_TABS[2], size: tokenData?.pages[0]?.page.totalCount },
      { tabName: REALM_DETAIL_TABS[3], size: internalData?.pages[0]?.page.totalCount },
      { tabName: REALM_DETAIL_TABS[4], size: eventData?.pages[0]?.page.totalCount },
    ],
    [directData, nativeData, tokenData, internalData, eventData],
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
          <StandardNetworkEventDatatable
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
