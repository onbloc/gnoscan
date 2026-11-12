import React from "react";

import { useActivityEvents } from "@/common/hooks/common/use-activity-events";
import { useFunctionFilteredPagedList } from "@/common/hooks/common/use-function-filtered-paged-list";
import { usePagedList } from "@/common/hooks/common/use-paged-list";
import { useHistoryEntryState } from "@/common/hooks/detail-tabs/use-history-entry-state";
import {
  useGetNftCollectionItems,
  useGetTokenEventsById,
  useGetTokenMetaInternalTransactionsById,
  useGetTokenMetaTransactionsById,
  useGetTokenTransfersById,
} from "@/common/react-query/token/api";
import { useGetRealmHoldersByPath } from "@/common/react-query/realm/api";
import { ACTIVITY_TAB, INVENTORY_TAB, NFT_COLLECTION_DETAIL_TABS } from "@/common/values/activity-tab.constant";

import { ListPagination } from "../../common/list-pagination/ListPagination";
import { FunctionFilter } from "../../common/function-filter/FunctionFilter";
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
  const enabled = !!tokenKey;
  const direct = useFunctionFilteredPagedList(
    "nft-direct",
    tokenKey,
    useGetTokenMetaTransactionsById,
    { path: tokenKey },
    { enabled },
  );
  const transfers = usePagedList("nft-transfers", tokenKey, useGetTokenTransfersById, { path: tokenKey }, { enabled });
  const internal = usePagedList(
    "nft-internal",
    tokenKey,
    useGetTokenMetaInternalTransactionsById,
    { path: tokenKey },
    { enabled },
  );
  const { data: holdersData } = useGetRealmHoldersByPath({ path: tokenKey, page: 1 });

  const events = useActivityEvents("nft", tokenKey, useGetTokenEventsById, { enabled: !!tokenKey });

  const tabSizes: Record<(typeof NFT_COLLECTION_DETAIL_TABS)[number], number | undefined> = {
    [INVENTORY_TAB]: inventoryData?.page.totalCount,
    [ACTIVITY_TAB.TRANSACTIONS]: direct.pagination.totalCount,
    [ACTIVITY_TAB.TOKEN_TRANSFERS]: transfers.pagination.totalCount,
    [ACTIVITY_TAB.INTERNAL_TRANSACTIONS]: internal.pagination.totalCount,
    [ACTIVITY_TAB.EVENTS]: events.allCount,
    [ACTIVITY_TAB.HOLDERS]: holdersData?.page.totalCount,
  };
  const tabs = NFT_COLLECTION_DETAIL_TABS.map(tabName => ({ tabName, size: tabSizes[tabName] }));

  return (
    <DataListSection
      tabs={tabs}
      tabActions={
        currentTab === ACTIVITY_TAB.TRANSACTIONS && (
          <FunctionFilter filter={direct.filter} onChange={direct.setFilter} />
        )
      }
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
    >
      {currentTab === INVENTORY_TAB && <NftCollectionInventory key={tokenKey} tokenKey={tokenKey} symbol={symbol} />}
      {currentTab === ACTIVITY_TAB.TRANSACTIONS && (
        <ActivityDatatable
          variant="direct"
          data={direct.items}
          isFetched={direct.isFetched}
          footer={<ListPagination {...direct.pagination} />}
        />
      )}
      {currentTab === ACTIVITY_TAB.TOKEN_TRANSFERS && (
        <ActivityDatatable
          variant="token-ids"
          data={transfers.items}
          isFetched={transfers.isFetched}
          footer={<ListPagination {...transfers.pagination} />}
        />
      )}
      {currentTab === ACTIVITY_TAB.INTERNAL_TRANSACTIONS && (
        <ActivityDatatable
          variant="internal"
          data={internal.items}
          isFetched={internal.isFetched}
          footer={<ListPagination {...internal.pagination} />}
        />
      )}
      {currentTab === ACTIVITY_TAB.EVENTS && (
        <>
          <ActivityEventsFilterBar {...events.filterBar} />
          <StandardNetworkEventDatatable
            variant="activity"
            isFetched={events.isFetched}
            events={events.events}
            footer={<ListPagination {...events.pagination} />}
          />
        </>
      )}
      {currentTab === ACTIVITY_TAB.HOLDERS && <NftCollectionHolders tokenKey={tokenKey} />}
    </DataListSection>
  );
};

export default NftCollectionTabs;
