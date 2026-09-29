import React from "react";
import Link from "next/link";

import DataListSection from "../../details-data-section/data-list-section";
import { TokenDetailDatatable } from "../../datatable";
import { TokenHoldersDatatablePage } from "../../datatable/token-detail/token-holders-page";
import { ActivityDatatable } from "../../datatable/activity";
import { StandardNetworkEventDatatable } from "../../datatable/event/StandardNetworkEventDatatable";
import { ActivityEventsFilterBar, StorageHiddenNotice } from "../../datatable/event/ActivityEventsFilterBar";
import {
  useGetTokenHoldersByid,
  useGetTokenMetaByPath,
  useGetTokenMetaTransactionsById,
  useGetTokenMetaInternalTransactionsById,
  useGetTokenTransfersById,
  useGetTokenEventsById,
  useGetTokens,
} from "@/common/react-query/token/api";
import { useGetRealmNativeTransfersByPath } from "@/common/react-query/realm/api";
import { useNetwork } from "@/common/hooks/use-network";
import { RealmMapper } from "@/common/mapper/realm/realm-mapper";
import { debounce } from "@/common/utils/string-util";
import { useHistoryEntryState } from "@/common/hooks/detail-tabs/use-history-entry-state";
import { isOnlyStorageEventsHidden } from "@/common/utils/activity.utility";
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
  const { getUrlWithNetwork } = useNetwork();
  const { data: tokenMeta, isFetched: isFetchedTokenMeta } = useGetTokenMetaByPath(tokenPath);
  const realmPath = tokenMeta?.data?.path ?? "";
  const hostedTokenCount = tokenMeta?.data?.hostedTokenCount ?? 0;
  const isFactoryRealm = hostedTokenCount >= 2;
  // Token meta settled without a realm path (404 or error): the native query never runs, so show it as empty.
  const isNativeUnavailable = isFetchedTokenMeta && !realmPath;

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
  const {
    data: hostedTokensData,
    hasNextPage: hasNextHostedTokensPage,
    fetchNextPage: fetchNextHostedTokensPage,
  } = useGetTokens(
    { packagePath: realmPath },
    {
      enabled: !isCustomNetwork && isFactoryRealm && !!realmPath && currentTab === ACTIVITY_TAB.NATIVE_TRANSFERS,
    },
  );

  // Events filters are restored with the history entry, so back/forward keeps the loaded list.
  const [eventTypeInput, setEventTypeInput] = useHistoryEntryState(`token:${tokenPath}:eventTypeInput`, "");
  const [eventType, setEventType] = useHistoryEntryState(`token:${tokenPath}:eventType`, "");
  const [includeStorage, setIncludeStorage] = useHistoryEntryState(`token:${tokenPath}:includeStorage`, false);
  const debouncedSetEventType = React.useMemo(() => debounce(setEventType, 300), [setEventType]);

  const handleEventTypeChange = (value: string) => {
    setEventTypeInput(value);
    debouncedSetEventType(value.trim());
  };

  const {
    data: eventData,
    isFetched: isFetchedEventData,
    isSuccess: isSuccessEventData,
    hasNextPage: hasNextPageEventData,
    fetchNextPage: fetchNextPageEventData,
  } = useGetTokenEventsById(
    { path: tokenPath, eventType: eventType || undefined, includeStorage },
    { enabled: !isCustomNetwork && !!tokenPath },
  );
  // Tab badge counts every token event, independent of the list filters.
  const { data: eventCountData } = useGetTokenEventsById(
    { path: tokenPath, includeStorage: true, limit: 1 },
    { enabled: !isCustomNetwork && !!tokenPath },
  );

  const directTransactions = React.useMemo(() => directData?.pages.flatMap(page => page.items) ?? [], [directData]);
  const nativeTransfers = React.useMemo(() => nativeData?.pages.flatMap(page => page.items) ?? [], [nativeData]);
  const tokenTransfers = React.useMemo(() => transfersData?.pages.flatMap(page => page.items) ?? [], [transfersData]);
  const hostedTokens = React.useMemo(
    () => hostedTokensData?.pages.flatMap(page => page.items) ?? [],
    [hostedTokensData],
  );
  const internalTransactions = React.useMemo(
    () => internalData?.pages.flatMap(page => page.items) ?? [],
    [internalData],
  );
  const tokenEvents = React.useMemo(() => {
    if (!eventData?.pages) return [];
    const allItems = eventData.pages.flatMap(page => page.items);
    return RealmMapper.realmEventFromApiResponses(allItems);
  }, [eventData?.pages]);

  const totalEventCount = eventCountData?.pages[0]?.page.totalCount;
  const onlyStorageEventsHidden = isOnlyStorageEventsHidden({
    isListSuccess: isSuccessEventData,
    totalEventCount,
    visibleEventCount: tokenEvents.length,
    eventType,
    includeStorage,
  });

  const transactionsCount = directData?.pages[0]?.page.totalCount;
  const holdersCount = holdersData?.pages[0]?.page.totalCount;

  const detailTabs = React.useMemo(() => {
    if (isCustomNetwork) {
      return [{ tabName: TOKEN_DETAIL_TABS[0], size: transactionsCount }];
    }

    return [
      { tabName: TOKEN_DETAIL_TABS[0], size: directData?.pages[0]?.page.totalCount },
      { tabName: TOKEN_DETAIL_TABS[1], size: isNativeUnavailable ? 0 : nativeData?.pages[0]?.page.totalCount },
      { tabName: TOKEN_DETAIL_TABS[2], size: transfersData?.pages[0]?.page.totalCount },
      { tabName: TOKEN_DETAIL_TABS[3], size: internalData?.pages[0]?.page.totalCount },
      { tabName: TOKEN_DETAIL_TABS[4], size: totalEventCount },
      { tabName: TOKEN_DETAIL_TABS[5], size: holdersCount },
    ];
  }, [
    isCustomNetwork,
    transactionsCount,
    directData,
    isNativeUnavailable,
    nativeData,
    transfersData,
    internalData,
    totalEventCount,
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
          {isFactoryRealm && (
            <FactoryNotice>
              <FactorySummary>
                <Text type="p4" color="tertiary">{`This factory token hosts ${hostedTokenCount} tokens:`}</Text>
                {hostedTokens.length > 0 && (
                  <HostedTokenList aria-label="Hosted tokens">
                    {hostedTokens.map(token => {
                      const tokenKey = token.path && token.symbol ? `${token.path}.${token.symbol}` : token.path;

                      return (
                        <Link key={token.tokenId} href={getUrlWithNetwork(`/tokens/${tokenKey}`)}>
                          {token.slug}
                        </Link>
                      );
                    })}
                  </HostedTokenList>
                )}
              </FactorySummary>
              {hasNextHostedTokensPage && (
                <MoreHostedTokensButton type="button" onClick={() => fetchNextHostedTokensPage()}>
                  View More Tokens
                </MoreHostedTokensButton>
              )}
            </FactoryNotice>
          )}
          <ActivityDatatable
            variant="transfers"
            data={nativeTransfers}
            isFetched={isFetchedNative || isNativeUnavailable}
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
          {onlyStorageEventsHidden && <StorageHiddenNotice />}
          <StandardNetworkEventDatatable
            variant="activity"
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
    flex-direction: column;
    gap: 8px;
    width: 100%;
    padding: 12px 16px;
    margin-bottom: 12px;
    background-color: ${({ theme }) => theme.colors.surface};
    border-radius: 8px;
  }
`;

const HostedTokenList = styled.div`
  ${({ theme }) => theme.fonts.p4};
  display: flex;
  flex-wrap: wrap;
  min-width: 0;

  a {
    ${({ theme }) => theme.fonts.p4};
    color: ${({ theme }) => theme.colors.blue};
    overflow-wrap: anywhere;

    &:not(:last-child)::after {
      color: ${({ theme }) => theme.colors.tertiary};
      content: ",";
      margin-right: 4px;
    }
  }
`;

const FactorySummary = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0 4px;
  min-width: 0;
`;

const MoreHostedTokensButton = styled.button`
  align-self: flex-start;
  color: ${({ theme }) => theme.colors.blue};
  background: none;
  cursor: pointer;
`;
