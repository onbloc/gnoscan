import React from "react";

import { useHistoryEntryState } from "@/common/hooks/detail-tabs/use-history-entry-state";
import { RealmMapper } from "@/common/mapper/realm/realm-mapper";
import {
  useGetNftCollectionItems,
  useGetTokenEventsById,
  useGetTokenMetaInternalTransactionsById,
  useGetTokenMetaTransactionsById,
  useGetTokenTransfersById,
} from "@/common/react-query/token/api";
import { useGetRealmHoldersByPath } from "@/common/react-query/realm/api";
import { debounce } from "@/common/utils/string-util";
import { ACTIVITY_TAB, INVENTORY_TAB, NFT_COLLECTION_DETAIL_TABS } from "@/common/values/activity-tab.constant";

import DataListSection from "../../details-data-section/data-list-section";
import { ActivityDatatable } from "../../datatable/activity";
import { ActivityEventsFilterBar } from "../../datatable/event/ActivityEventsFilterBar";
import { StandardNetworkEventDatatable } from "../../datatable/event/StandardNetworkEventDatatable";
import NftCollectionHolders from "../collection-holders/NftCollectionHolders";
import NftCollectionInventory, { NFT_INVENTORY_PAGE_SIZE } from "../collection-inventory/NftCollectionInventory";

interface NftCollectionTabsProps {
  tokenKey: string;
  symbol: string;
}

const NftCollectionTabs = ({ tokenKey, symbol }: NftCollectionTabsProps) => {
  const [currentTab, setCurrentTab] = useHistoryEntryState<string>(`nft:${tokenKey}:tab`, INVENTORY_TAB);

  // Same query as the Inventory grid, so the tab count shares its first page.
  const { data: inventoryData } = useGetNftCollectionItems({ tokenKey, limit: NFT_INVENTORY_PAGE_SIZE });
  const {
    data: directData,
    isFetched: isFetchedDirect,
    hasNextPage: hasNextPageDirect,
    fetchNextPage: fetchNextPageDirect,
  } = useGetTokenMetaTransactionsById({ path: tokenKey }, { enabled: !!tokenKey });
  const {
    data: transfersData,
    isFetched: isFetchedTransfers,
    hasNextPage: hasNextPageTransfers,
    fetchNextPage: fetchNextPageTransfers,
  } = useGetTokenTransfersById({ path: tokenKey }, { enabled: !!tokenKey });
  const {
    data: internalData,
    isFetched: isFetchedInternal,
    hasNextPage: hasNextPageInternal,
    fetchNextPage: fetchNextPageInternal,
  } = useGetTokenMetaInternalTransactionsById({ path: tokenKey }, { enabled: !!tokenKey });
  const { data: holdersData } = useGetRealmHoldersByPath({ path: tokenKey });

  // Events filters are restored with the history entry, so back/forward keeps the loaded list.
  const [eventTypeInput, setEventTypeInput] = useHistoryEntryState(`nft:${tokenKey}:eventTypeInput`, "");
  const [eventType, setEventType] = useHistoryEntryState(`nft:${tokenKey}:eventType`, "");
  const [includeStorage, setIncludeStorage] = useHistoryEntryState(`nft:${tokenKey}:includeStorage`, false);
  const debouncedSetEventType = React.useMemo(() => debounce(setEventType, 300), [setEventType]);

  const {
    data: eventData,
    isFetched: isFetchedEventData,
    hasNextPage: hasNextPageEventData,
    fetchNextPage: fetchNextPageEventData,
  } = useGetTokenEventsById(
    { path: tokenKey, eventType: eventType || undefined, includeStorage },
    { enabled: !!tokenKey },
  );
  // Tab badge counts every collection event, independent of the list filters.
  const { data: eventCountData } = useGetTokenEventsById(
    { path: tokenKey, includeStorage: true, limit: 1 },
    { enabled: !!tokenKey },
  );

  const directTransactions = React.useMemo(() => directData?.pages.flatMap(page => page.items) ?? [], [directData]);
  const tokenTransfers = React.useMemo(() => transfersData?.pages.flatMap(page => page.items) ?? [], [transfersData]);
  const internalTransactions = React.useMemo(
    () => internalData?.pages.flatMap(page => page.items) ?? [],
    [internalData],
  );
  const collectionEvents = React.useMemo(
    () => RealmMapper.realmEventFromApiResponses(eventData?.pages.flatMap(page => page.items) ?? []),
    [eventData?.pages],
  );

  const tabSizes: Record<(typeof NFT_COLLECTION_DETAIL_TABS)[number], number | undefined> = {
    [INVENTORY_TAB]: inventoryData?.page.totalCount,
    [ACTIVITY_TAB.TRANSACTIONS]: directData?.pages[0]?.page.totalCount,
    [ACTIVITY_TAB.TOKEN_TRANSFERS]: transfersData?.pages[0]?.page.totalCount,
    [ACTIVITY_TAB.INTERNAL_TRANSACTIONS]: internalData?.pages[0]?.page.totalCount,
    [ACTIVITY_TAB.EVENTS]: eventCountData?.pages[0]?.page.totalCount,
    [ACTIVITY_TAB.HOLDERS]: holdersData?.pages[0]?.page.totalCount,
  };
  const tabs = NFT_COLLECTION_DETAIL_TABS.map(tabName => ({ tabName, size: tabSizes[tabName] }));

  return (
    <DataListSection tabs={tabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === INVENTORY_TAB && <NftCollectionInventory tokenKey={tokenKey} symbol={symbol} />}
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
      {currentTab === ACTIVITY_TAB.TOKEN_TRANSFERS && (
        <ActivityDatatable
          variant="token-volume"
          data={tokenTransfers}
          isFetched={isFetchedTransfers}
          hasNextPage={hasNextPageTransfers}
          nextPage={fetchNextPageTransfers}
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
            onEventTypeChange={value => {
              setEventTypeInput(value);
              debouncedSetEventType(value.trim());
            }}
            includeStorage={includeStorage}
            onIncludeStorageChange={setIncludeStorage}
          />
          <StandardNetworkEventDatatable
            variant="activity"
            isFetched={isFetchedEventData}
            events={collectionEvents}
            hasNextPage={hasNextPageEventData}
            nextPage={fetchNextPageEventData}
          />
        </>
      )}
      {currentTab === ACTIVITY_TAB.HOLDERS && <NftCollectionHolders tokenKey={tokenKey} />}
    </DataListSection>
  );
};

export default NftCollectionTabs;
