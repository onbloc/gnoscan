import React from "react";

import DataListSection from "../../details-data-section/data-list-section";
import { TokenDetailDatatable } from "../../datatable";
import { TokenHoldersDatatablePage } from "../../datatable/token-detail/token-holders-page";
import { ActivityDatatable } from "../../datatable/activity";
import { StandardNetworkEventDatatable } from "../../datatable/event/StandardNetworkEventDatatable";
import { ActivityEventsFilterBar } from "../../datatable/event/ActivityEventsFilterBar";
import {
  useGetTokenHoldersByid,
  useGetTokenMetaByPath,
  useGetTokenMetaTransactionsById,
  useGetTokenMetaInternalTransactionsById,
  useGetTokenTransfersById,
  useGetTokenEventsById,
} from "@/common/react-query/token/api";
import { useGetRealmNativeTransfersByPath } from "@/common/react-query/realm/api";
import { RealmMapper } from "@/common/mapper/realm/realm-mapper";
import { debounce } from "@/common/utils/string-util";
import { TOKEN_DETAIL_TABS, ACTIVITY_TAB } from "@/common/values/activity-tab.constant";
import Text from "@/components/ui/text";
import styled from "styled-components";

interface TokenTransactionInfoProps {
  tokenPath: string;
  isCustomNetwork: boolean;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const TokenTransactionInfo = ({ tokenPath, isCustomNetwork, currentTab, setCurrentTab }: TokenTransactionInfoProps) => {
  const { data: tokenMeta } = useGetTokenMetaByPath(tokenPath);
  const realmPath = tokenMeta?.data?.path ?? "";
  const hostedTokenCount = tokenMeta?.data?.hostedTokenCount ?? 0;

  const {
    data: directData,
    isFetched: isFetchedDirect,
    hasNextPage: hasNextPageDirect,
    fetchNextPage: fetchNextPageDirect,
  } = useGetTokenMetaTransactionsById({ path: tokenPath }, { enabled: !isCustomNetwork && !!tokenPath });
  const {
    data: nativeData,
    isFetched: isFetchedNative,
    hasNextPage: hasNextPageNative,
    fetchNextPage: fetchNextPageNative,
  } = useGetRealmNativeTransfersByPath({ path: realmPath }, { enabled: !isCustomNetwork && !!realmPath });
  const {
    data: transfersData,
    isFetched: isFetchedTransfers,
    hasNextPage: hasNextPageTransfers,
    fetchNextPage: fetchNextPageTransfers,
  } = useGetTokenTransfersById({ path: tokenPath }, { enabled: !isCustomNetwork && !!tokenPath });
  const {
    data: internalData,
    isFetched: isFetchedInternal,
    hasNextPage: hasNextPageInternal,
    fetchNextPage: fetchNextPageInternal,
  } = useGetTokenMetaInternalTransactionsById({ path: tokenPath }, { enabled: !isCustomNetwork && !!tokenPath });
  const { data: holdersData } = useGetTokenHoldersByid(
    { path: tokenPath },
    { enabled: !isCustomNetwork && !!tokenPath },
  );

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
  } = useGetTokenEventsById(
    { path: tokenPath, eventType: eventType || undefined, includeStorage },
    { enabled: !isCustomNetwork && !!tokenPath },
  );

  const directTransactions = React.useMemo(() => directData?.pages.flatMap(page => page.items) ?? [], [directData]);
  const nativeTransfers = React.useMemo(() => nativeData?.pages.flatMap(page => page.items) ?? [], [nativeData]);
  const tokenTransfers = React.useMemo(() => transfersData?.pages.flatMap(page => page.items) ?? [], [transfersData]);
  const internalTransactions = React.useMemo(
    () => internalData?.pages.flatMap(page => page.items) ?? [],
    [internalData],
  );
  const tokenEvents = React.useMemo(() => {
    if (!eventData?.pages) return [];
    const allItems = eventData.pages.flatMap(page => page.items);
    return RealmMapper.realmEventFromApiResponses(allItems);
  }, [eventData?.pages]);

  const transactionsCount = directData?.pages[0]?.page.totalCount;
  const holdersCount = holdersData?.pages[0]?.page.totalCount;

  const detailTabs = React.useMemo(() => {
    if (isCustomNetwork) {
      return [{ tabName: TOKEN_DETAIL_TABS[0], size: transactionsCount }];
    }

    return [
      { tabName: TOKEN_DETAIL_TABS[0], size: directData?.pages[0]?.page.totalCount },
      { tabName: TOKEN_DETAIL_TABS[1], size: nativeData?.pages[0]?.page.totalCount },
      { tabName: TOKEN_DETAIL_TABS[2], size: transfersData?.pages[0]?.page.totalCount },
      { tabName: TOKEN_DETAIL_TABS[3], size: internalData?.pages[0]?.page.totalCount },
      { tabName: TOKEN_DETAIL_TABS[4], size: eventData?.pages[0]?.page.totalCount },
      { tabName: TOKEN_DETAIL_TABS[5], size: holdersCount },
    ];
  }, [
    isCustomNetwork,
    transactionsCount,
    directData,
    nativeData,
    transfersData,
    internalData,
    eventData,
    holdersCount,
  ]);

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {tokenPath && isCustomNetwork && currentTab === ACTIVITY_TAB.TRANSACTIONS && (
        <TokenDetailDatatable path={tokenPath} />
      )}
      {tokenPath && !isCustomNetwork && currentTab === ACTIVITY_TAB.TRANSACTIONS && (
        <ActivityDatatable
          variant="direct"
          data={directTransactions}
          isFetched={isFetchedDirect}
          hasNextPage={hasNextPageDirect}
          nextPage={fetchNextPageDirect}
          moreLabel="View More Transactions"
        />
      )}
      {tokenPath && !isCustomNetwork && currentTab === ACTIVITY_TAB.NATIVE_TRANSFERS && (
        <>
          {hostedTokenCount >= 2 && (
            <FactoryNotice>
              <Text type="p4" color="tertiary">{`This realm hosts ${hostedTokenCount} tokens.`}</Text>
            </FactoryNotice>
          )}
          <ActivityDatatable
            variant="transfers"
            data={nativeTransfers}
            isFetched={isFetchedNative}
            hasNextPage={hasNextPageNative}
            nextPage={fetchNextPageNative}
            moreLabel="View More Transfers"
          />
        </>
      )}
      {tokenPath && !isCustomNetwork && currentTab === ACTIVITY_TAB.TOKEN_TRANSFERS && (
        <ActivityDatatable
          variant="token-volume"
          data={tokenTransfers}
          isFetched={isFetchedTransfers}
          hasNextPage={hasNextPageTransfers}
          nextPage={fetchNextPageTransfers}
          moreLabel="View More Transfers"
        />
      )}
      {tokenPath && !isCustomNetwork && currentTab === ACTIVITY_TAB.INTERNAL_TRANSACTIONS && (
        <ActivityDatatable
          variant="internal"
          data={internalTransactions}
          isFetched={isFetchedInternal}
          hasNextPage={hasNextPageInternal}
          nextPage={fetchNextPageInternal}
          moreLabel="View More Transactions"
        />
      )}
      {tokenPath && !isCustomNetwork && currentTab === ACTIVITY_TAB.EVENTS && (
        <>
          <ActivityEventsFilterBar
            eventType={eventTypeInput}
            onEventTypeChange={handleEventTypeChange}
            includeStorage={includeStorage}
            onIncludeStorageChange={setIncludeStorage}
          />
          <StandardNetworkEventDatatable
            isFetched={isFetchedEventData}
            events={tokenEvents}
            hasNextPage={hasNextPageEventData}
            nextPage={fetchNextPageEventData}
          />
        </>
      )}
      {tokenPath && !isCustomNetwork && currentTab === ACTIVITY_TAB.HOLDERS && (
        <TokenHoldersDatatablePage path={tokenPath} />
      )}
    </DataListSection>
  );
};

export default TokenTransactionInfo;

const FactoryNotice = styled.div`
  & {
    display: flex;
    width: 100%;
    padding: 12px 16px;
    margin-bottom: 12px;
    background-color: ${({ theme }) => theme.colors.surface};
    border-radius: 8px;
  }
`;
